import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Inject,
  Optional,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, getProductMeta } from '@app/models/product.model';
import { AppService } from '@app/services/app.service';
import { ProductService } from '../services/product.service';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';
import { FormGroup } from '@angular/forms';
import {
  ProductInventory,
  getProductInventoryMeta,
} from '@app/models/product-inventory.model';
import { of, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  form: FormGroup;
  inventoryForm: FormGroup;
  isEdit: boolean;
  formMeta = new FormMeta();
  modelMeta: ModelMeta[];
  inventoryMeta: ModelMeta[];

  constructor(
    private app: AppService,
    private route: ActivatedRoute,
    private service: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { isDialog: boolean; productId?: string }
  ) {
    if (this.data && this.data.productId) {
      console.log('Received productId:', this.data.productId);
      // You can access this.data.productId in your component logic
    }
  }

  ngOnInit(): void {
    this.modelMeta = getProductMeta();
    this.inventoryMeta = getProductInventoryMeta();
    if (this.data?.isDialog) {
      if (this.data.productId) {
        this.buildProductForm(this.data.productId);
      } else {
        this.buildNewProductForm();
      }
    } else {
      this.route.params.subscribe((x) => {
        if (x['id']) {
          let productId = x['id'];
          this.buildProductForm(productId);
        } else {
          this.buildNewProductForm();
        }
      });
    }
  }

  private buildNewProductForm() {
    this.form = this.app.meta.toFormGroup({ isActive: true }, this.modelMeta);
    this.inventoryForm = this.app.meta.toFormGroup({}, this.inventoryMeta);
  }

  private buildProductForm(productId: string) {
    this.isEdit = true;
    this.service.get(productId).subscribe((y) => {
      this.form = this.app.meta.toFormGroup(y, this.modelMeta);
    });

    this.service.getProductInventory(productId).subscribe((y) => {
      this.inventoryForm = this.app.meta.toFormGroup(y, this.inventoryMeta);
    });
  }

  saveProduct(addMore?: boolean) {
    FormHelper.submit(
      this.form,
      this.formMeta,
      () => {
        let productId = this.form.value['productId'];
        if (productId) {
          // edit
          if (this.form.value.isInventory === true) {
            let productInventory = this.inventoryForm.value;
            productInventory.productId = productId;
            this.service.saveInventory(productInventory).subscribe((x) => {
              console.log(x);
            });
          }
          this.service.update(this.form.value).subscribe((x) => {
            console.log(x);
            this.app.noty.notifyUpdated('Product has been');

            // Check if the component was opened within a dialog, and close it
            if (this.data && this.data.isDialog) {
              this.dialog.closeAll();
            } else {
              this.router.navigate(['../'], { relativeTo: this.route });
            }
          });
        } else {
          // add
          this.service
            .add(this.form.value)
            .pipe(
              switchMap((x: Product | any) => {
                let productInventory = this.inventoryForm.value;
                productInventory.productId = x.productId;
                // save inventory if managing inventory for this product
                if (x.isInventory === true) {
                  return this.service.saveInventory(productInventory);
                } else {
                  return of(x);
                }
              })
            )
            .subscribe((x: Product | ProductInventory | any) => {
              console.log(x);
              this.app.noty.notifyClose('Product has been added');
              if (addMore) {
                this.form = this.app.meta.toFormGroup(
                  { isActive: true },
                  this.modelMeta
                );
                this.inventoryForm.reset();
                this.form.markAsPristine();
                this.form.markAsUntouched();
                this.form.updateValueAndValidity();
                this.cdr.markForCheck();
              } else {
                this.form.reset();
                this.inventoryForm.reset();

                // Check if the component was opened within a dialog, and close it
                if (this.data && this.data.isDialog) {
                  this.dialog.closeAll();
                } else {
                  this.router.navigate(['../', x.productId], {
                    relativeTo: this.route,
                  });
                }
              }
            });
        }
      },
      true
    );
  }
}
