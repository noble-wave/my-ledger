import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getProductMeta } from '@app/models/product.model';
import { AppService } from '@app/services/app.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  form: any;
  isEdit: boolean;

  constructor(private app: AppService, private route: ActivatedRoute, private service: ProductService) {
  }

  ngOnInit(): void {


    this.route.params.subscribe(x => {
      if (x['id']) {
        this.isEdit = true;
        this.service.get(x['id']).subscribe(y => {
          this.form = this.app.meta.toFormGroup(y, getProductMeta());
        });
      } else {
        this.form = this.app.meta.toFormGroup({}, getProductMeta());
      }
    });
  }
}
