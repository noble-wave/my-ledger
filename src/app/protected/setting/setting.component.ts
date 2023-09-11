import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { FormGroup } from '@angular/forms';
import { getOrderSettingMeta } from '@app/models/order-setting.model';
import { ModelMeta } from '@app/shared-services';
import { AppService } from '@app/services/app.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  statusOption: { label: string; value: any }[];
  form: FormGroup;
  modelMeta: ModelMeta[];

  constructor(
    private orderService: OrderService,
    private app: AppService,
    private setting: SettingService
  ) {}

  ngOnInit(): void {
    this.modelMeta = getOrderSettingMeta();
    this.statusOption = this.orderService.getStatusOptions();
    // Retrieve order settings and populate the form
    this.setting.getOrderSetting().subscribe((data) => {
      if (data && data.length > 0) {
        const orderSettings = data[0]; // Extract the settings from the array
        this.form.patchValue(orderSettings);
      }
    });
    this.form = this.app.meta.toFormGroup({}, this.modelMeta);
  }

  saveSetting() {
    let formValue = this.form.value;
    console.log(formValue);
    this.setting.addOrderSetting(formValue).subscribe();
  }

  
  saveSettings() {
    const formValue = this.form.value;
    console.log(formValue);
  
    // Check if data exists in the storage
    this.setting.getOrderSetting().subscribe((settings) => {
      if (settings && settings.length > 0) {
        // Data exists, update it
        const existingSetting = { ...settings[0], ...formValue };
        this.setting.update(existingSetting).subscribe(() => {
          this.form.patchValue({
            defaultOrderStatus: existingSetting.defaultOrderStatus,
          });
        });
      } else {
        // No data exists, add it
        this.setting.addOrderSetting(formValue).subscribe(() => {
          this.setting.getOrderSetting().subscribe((newSettings) => {
            if (newSettings && newSettings.length > 0) {
              const newSetting = newSettings[0];
              this.form.patchValue({
                defaultOrderStatus: newSetting.defaultOrderStatus,
              });
            }
          });
        });
      }
    });
  }
  
}
