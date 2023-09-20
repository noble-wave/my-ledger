import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  OrderSettings,
  QuickOrderSettings,
  getOrderSettingMeta,
  getQuickOrderSettingMeta,
} from '@app/models/order-setting.model';
import { ModelMeta } from '@app/shared-services';
import { AppService } from '@app/services/app.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  statusOptions: { label: string; value: any }[];
  form: FormGroup;
  modelMeta: ModelMeta[];
  quickOrderForm: FormGroup;
  quickOrderMeta: ModelMeta[];

  unitPrices: Array<number> = [];

  constructor(
    private orderService: OrderService,
    private app: AppService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.modelMeta = getOrderSettingMeta();
    this.statusOptions = this.orderService.getStatusOptions();
    // Retrieve order settings and populate the form
    this.form = this.app.meta.toFormGroup(new OrderSettings(), this.modelMeta);
    this.settingService.getOrderSetting().subscribe((orderSettings) => {
      this.form.patchValue(orderSettings);
    });

    //save unit price for Quick order Page
    this.quickOrderMeta = getQuickOrderSettingMeta();
    this.quickOrderForm = this.app.meta.toFormGroup(
      new QuickOrderSettings(),
      this.quickOrderMeta
    );
    this.settingService.getQuickOrderSetting().subscribe((model) => {
      this.quickOrderForm.patchValue(model);
      this.unitPrices = [...this.quickOrderForm.value.unitPrices];
    });
  }

  // Deprecated
  saveSetting() {
    let formValue = this.form.value;
    console.log(formValue);
    this.settingService.addOrderSetting(formValue).subscribe();
  }

  saveOrderSetting() {
    const formValue = this.form.value;
    console.log(formValue);

    // Check if data exists in the storage
    this.settingService.getOrderSetting().subscribe((settings) => {
      if (settings && settings.id) {
        // Data exists, update it
        let existingSetting = { ...settings, ...formValue };
        this.settingService.update(existingSetting).subscribe(() => {
          this.form.patchValue(existingSetting);
        });
        this.app.noty.notifyUpdated('Setting has been');
      } else {
        // No data exists, add it
        this.settingService
          .addOrderSetting(formValue)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.form.patchValue(newSettings);
              this.app.noty.notifyAdded('Setting has been');
            }
          });
      }
    });
  }

  // addMore() {
  //   const unitPricesFormArray = this.quickOrderForm.get('unitPrices') as FormArray;
  //   unitPricesFormArray.push(this.createUnitPriceFormGroup()); // Add a new unit price control
  //   this.unitPrices.push(0); // Add a new element with an initial value of null to your unitPrices array
  // }
  

  saveQuickOrderSetting() {
    let orderItems = this.quickOrderForm.value;
    orderItems.unitPrices = this.unitPrices;
    console.log(orderItems);
  }
}
