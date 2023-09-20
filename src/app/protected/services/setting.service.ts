import { Injectable } from '@angular/core';
import { OrderSettings, QuickOrderSettings } from '@app/models/order-setting.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private storage: StorageService) {}

  addOrderSetting(settings: OrderSettings) {
    settings.name = 'orderSettings';
    delete settings.id;
    return this.storage.addRecord<OrderSettings>(tableNames.misc, settings);
  }

  addQuickOrderSetting(quickOrderSettings: QuickOrderSettings) {
    quickOrderSettings.name = 'quickOrderSettings';
    delete quickOrderSettings.id;
    return this.storage.addRecord<QuickOrderSettings>(tableNames.misc, quickOrderSettings);
  }

  update(settings: OrderSettings) {
    settings.name = 'orderSettings';
    return this.storage.updateRecord(tableNames.misc, settings);
  }
  
  quickOrderUpdate(quickOrderSettings: QuickOrderSettings) {
    quickOrderSettings.name = 'quickOrderSettings';
    return this.storage.updateRecord(tableNames.misc, quickOrderSettings);
  }

  getOrderSetting() {
    return this.storage
      .getByIndex<OrderSettings>(tableNames.misc, 'name', 'orderSettings')
      .pipe(
        map((x) => {
          if (x) {
            return x;
          } else {
            return new OrderSettings();
          }
        })
      );
  }

  getQuickOrderSetting() {
    return this.storage
      .getByIndex<QuickOrderSettings>(tableNames.misc, 'name', 'quickOrderSettings')
      .pipe(
        map((x) => {
          if (x) {
            return x;
          } else {
            return new QuickOrderSettings();
          }
        })
      );
  }
}
