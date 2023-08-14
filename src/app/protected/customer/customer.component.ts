import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/services/app.service';
import { CustomerService } from '../services/customer.service';
import { getCustomerMeta } from '@app/models/customer.model';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  form: any;
  isEdit: boolean;
  formMeta = new FormMeta();

  constructor(private app: AppService, private route: ActivatedRoute, private service: CustomerService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    let modelMeta = getCustomerMeta();
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
