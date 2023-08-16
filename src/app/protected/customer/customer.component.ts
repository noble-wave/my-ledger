import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/services/app.service';
import { CustomerService } from '../services/customer.service';
import { getCustomerMeta } from '@app/models/customer.model';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  form: FormGroup;
  isEdit: boolean;
  formMeta = new FormMeta();
  modelMeta: ModelMeta[];

  constructor(
    private app: AppService,
    private route: ActivatedRoute,
    private service: CustomerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modelMeta = getCustomerMeta();
    this.route.params.subscribe((x) => {
      if (x['id']) {
        this.isEdit = true;
        this.service.get(x['id']).subscribe((y) => {
          this.form = this.app.meta.toFormGroup(y, this.modelMeta);
        });
      } else {
        this.form = this.app.meta.toFormGroup({ isActive: true }, this.modelMeta);
      }
    });
  }

  saveProduct() {
    FormHelper.submit(this.form, this.formMeta, () => {
      if (this.form.value['customerId']) {
        this.service.update(this.form.value).subscribe((x) => {
          console.log(x);
          this.app.noty.notifyUpdated('Detail has been updated.');
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      } else {
        this.service.add(this.form.value).subscribe((x) => {
          console.log(x);
          this.app.noty.notifyAdded('Detail has been saved.');
          this.form.reset();
          this.router.navigate(['../', x.customerId], { relativeTo: this.route });
          // this.form = this.app.meta.toFormGroup({ isActive: true }, this.modelMeta);
          // this.form.markAsPristine();
          // this.form.markAsUntouched();
          // this.form.updateValueAndValidity();
          // this.cdr.markForCheck();
          // this.form.reset();
        });
      }
    });
  }
}
