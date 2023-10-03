import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getProductMeta } from '@app/models/product.model';
import { AppService } from '@app/services/app.service';
import { ProductService } from '../services/product.service';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';
import { FormGroup } from '@angular/forms';
import { getProductInventoryMeta } from '@app/models/product-inventory.model';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.modelMeta = getProductMeta();
    this.inventoryMeta = getProductInventoryMeta();
    this.route.params.subscribe((x) => {
      if (x['id']) {
        this.isEdit = true;
        this.service.get(x['id']).subscribe((y) => {
          this.form = this.app.meta.toFormGroup(y, this.modelMeta);
        });

        this.service.getProductInventory(x['id']).subscribe((y) => {
          this.inventoryForm = this.app.meta.toFormGroup(y, this.inventoryMeta);
        });
      } else {
        this.form = this.app.meta.toFormGroup(
          { isActive: true },
          this.modelMeta
        );
        this.inventoryForm = this.app.meta.toFormGroup({}, this.inventoryMeta);
      }
    });
  }

  saveProduct(addMore?: boolean) {
    FormHelper.submit(this.form, this.formMeta, () => {
        if (this.form.value['productId']) {
          // edit
          this.service.saveInventory(this.inventoryForm.value).subscribe((x) => {
              console.log(x);
            });
          this.service.update(this.form.value).subscribe((x) => {
            console.log(x);
            this.app.noty.notifyUpdated('Product has been');
            this.router.navigate(['../'], { relativeTo: this.route });
          });
        } else {
          // add
          this.service
            .add(this.form.value)
            .pipe(
              switchMap((x) => {
                let productInventory = this.inventoryForm.value;
                productInventory.productId = x.productId;
                // productInventory.productName = x.productName;
                return this.service.saveInventory(productInventory);
              })
            )
            .subscribe((x) => {
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
                this.dialog.closeAll();
                this.router.navigate(['../', x.productId], {
                  relativeTo: this.route,
                });
              }
            });
        }
      }, true);
  }
}
