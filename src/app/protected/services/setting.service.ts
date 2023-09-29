import { Injectable } from '@angular/core';
import { SellSettings, QuickSellSettings } from '@app/models/sell-setting.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private storage: StorageService) {}

  addSellSetting(settings: SellSettings) {
    settings.name = 'sellSettings';
    delete settings.id;
    return this.storage.addRecord<SellSettings>(tableNames.misc, settings);
  }

  addQuickSellSetting(quickSellSettings: QuickSellSettings) {
    quickSellSettings.name = 'quickSellSettings';
    delete quickSellSettings.id;
    return this.storage.addRecord<QuickSellSettings>(tableNames.misc, quickSellSettings);
  }

  update(settings: SellSettings) {
    settings.name = 'sellSettings';
    return this.storage.updateRecord(tableNames.misc, settings);
  }
  
  quickSellUpdate(quickSellSettings: QuickSellSettings) {
    quickSellSettings.name = 'quickSellSettings';
    return this.storage.updateRecord(tableNames.misc, quickSellSettings);
  }

  getSellSetting() {
    return this.storage
      .getByIndex<SellSettings>(tableNames.misc, 'name', 'sellSettings')
      .pipe(
        map((x) => {
          if (x) {
            return x;
          } else {
            return new SellSettings();
          }
        })
      );
  }

  getQuickSellSetting() {
    return this.storage
      .getByIndex<QuickSellSettings>(tableNames.misc, 'name', 'quickSellSettings')
      .pipe(
        map((x) => {
          if (x) {
            return x;
          } else {
            return new QuickSellSettings();
          }
        })
      );
  }
}
