import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getProductMeta } from '@app/models/product.model';
import { AppService } from '@app/services/app.service';
import { ProductService } from '../services/product.service';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  form: any;
  isEdit: boolean;
  formMeta = new FormMeta();

  constructor(private app: AppService, private route: ActivatedRoute, private service: ProductService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    let modelMeta = getProductMeta();
    this.route.params.subscribe(x => {
      if (x['id']) {
        this.isEdit = true;
        this.service.get(x['id']).subscribe(y => {
          this.form = this.app.meta.toFormGroup(y, modelMeta);
        });
      } else {
        this.form = this.app.meta.toFormGroup({ isActive: true }, modelMeta);
      }
    });
  }

  saveProduct() {
    FormHelper.submit(this.form, this.formMeta, () => {
      this.service.add(this.form.value).subscribe(x => {
        console.log(x);
        this.form.reset();
      });
    });
  }

}
