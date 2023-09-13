import { Injectable } from '@angular/core';
import { OrderSettings } from '@app/models/order-setting.model';
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

  update(settings: OrderSettings) {
    settings.name = 'orderSettings';
    return this.storage.updateRecord(tableNames.misc, settings);
  }

  getOrderSetting() {
    return this.storage
      .getByIndex<OrderSettings>(
        tableNames.misc,
        'name',
        'orderSettings'
      )
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
}
