import { Component, OnDestroy } from '@angular/core';
import { SellService } from '../services/sell.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SellSettings,
  QuickSellSettings,
  getSellSettingMeta,
  getQuickSellSettingMeta,
  getSellPrintSettingsMeta,
  SellPrintSettings,
  getDashboardSettingMeta,
  DashboardSettings,
} from '@app/models/sell-setting.model';
import { ModelMeta } from '@app/shared-services';
import { AppService } from '@app/services/app.service';
import { SettingService } from '../services/setting.service';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RefreshService } from '../services/refresh.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  statusOptions: { label: string; value: any }[];
  form: FormGroup;
  modelMeta: ModelMeta[];
  quickSellForm: FormGroup;
  quickSellMeta: ModelMeta[];
  sellPrintForm: FormGroup;
  sellPrintMeta: ModelMeta[];
  dashboardForm: FormGroup;
  dashboardMeta: ModelMeta[];
  sellSetting: any = { manageSellStatus: true };
  quicksellSetting: any = { manageQuickSell: false };
  imageBlob: Blob;

  unitPrices: Array<number> = [];

  constructor(
    private sellService: SellService,
    private app: AppService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      console.log('Fragment:', fragment);
      if (fragment) {
        this.scrollToElement(fragment);
      }
    });

    this.modelMeta = getSellSettingMeta();
    this.statusOptions = this.sellService.getStatusOptions();
    // Retrieve sell settings and populate the form
    this.form = this.app.meta.toFormGroup(new SellSettings(), this.modelMeta);

    this.form.get('manageSellStatus')?.valueChanges.subscribe((x) => {
      this.sellSetting.manageSellStatus = x;
    });

    this.settingService
      .getSellSetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sellSettings) => {
        this.form.patchValue(sellSettings);
        this.sellSetting = sellSettings;
      });

    this.sellPrintMeta = getSellPrintSettingsMeta();
    this.sellPrintForm = this.app.meta.toFormGroup(
      new SellPrintSettings(),
      this.sellPrintMeta
    );
    this.settingService
      .getSellPrintSetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.sellPrintForm.patchValue(x);
      });

    //Dashboard setting
    this.dashboardMeta = getDashboardSettingMeta();
    this.dashboardForm = this.app.meta.toFormGroup(
      new DashboardSettings(),
      this.dashboardMeta
    );
    this.settingService
      .getDashboardSetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.dashboardForm.patchValue(x);
      });

    //save unit price for Quick sell Page
    this.quickSellMeta = getQuickSellSettingMeta();
    this.quickSellForm = this.app.meta.toFormGroup(
      new QuickSellSettings(),
      this.quickSellMeta
    );
    this.quickSellForm.get('manageQuickSell')?.valueChanges.subscribe((x) => {
      this.quicksellSetting.manageQuickSell = x;
    });

    this.settingService
      .getQuickSellSetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.quickSellForm.patchValue(x);
        this.unitPrices = [...this.quickSellForm.value.unitPrices];
        this.quicksellSetting = x;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  private scrollToElement(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  // Deprecated
  saveSetting() {
    let formValue = this.form.value;
    console.log(formValue);
    this.settingService.addSellSetting(formValue).subscribe();
  }

  saveSellSetting() {
    const formValue = this.form.value;
    console.log(formValue);

    // Update the sellSetting variable immediately
    this.sellSetting = { ...this.sellSetting, ...formValue };

    // Check if data exists in the storage
    this.settingService.getSellSetting().subscribe((settings) => {
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
          .addSellSetting(formValue)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.form.patchValue(newSettings);
              this.app.noty.notifyAdded('Setting has been');
            }
          });
      }
    });
  }

  addMore() {
    const unitPricesFormArray = this.quickSellForm.get(
      'unitPrices'
    ) as FormArray;
    unitPricesFormArray.push(this.fb.control(''));
  }

  saveQuickSellSetting() {
    let quickSellSetting = this.quickSellForm.value;
    this.refreshService.isChnage$.next(quickSellSetting);
    quickSellSetting.unitPrices = this.unitPrices;
    console.log(quickSellSetting);
    // Check if data exists in the storage
    this.settingService.getQuickSellSetting().subscribe((x) => {
      if (x && x.id) {
        // Data exists, update it
        let existingSetting = { ...x, ...quickSellSetting };
        this.settingService.quickSellUpdate(existingSetting).subscribe(() => {
          this.form.patchValue(existingSetting);
        });
        this.app.noty.notifyUpdated('Quick Setting has been');
      } else {
        // No data exists, add it
        this.settingService
          .addQuickSellSetting(quickSellSetting)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.form.patchValue(newSettings);
              this.app.noty.notifyAdded('Quick Setting has been');
            }
          });
      }
    });
  }

  onRadioChange(manageSellStatus: any) {
    console.log('Selected sell Status:', manageSellStatus);
    this.form.get('manageSellStatus')?.setValue(manageSellStatus.value);
  }

  navigateBack() {
    this.location.back();
  }

  onFileChange(event: any): void {
    if (event.target.value) {
      const file = event.target.files[0];
      this.imageBlob = new Blob([file], { type: file.type });
    }
  }

  saveSellPrintSetting() {
    this.sellPrintForm.get('logoUrl')?.setValue(this.imageBlob);
    const formValue = this.sellPrintForm.value;
    console.log(formValue);

    // Check if data exists in the storage
    this.settingService.getSellPrintSetting().subscribe((settings) => {
      if (settings && settings.id) {
        // Data exists, update it
        let existingSetting = { ...settings, ...formValue };
        this.settingService.SellPrintUpdate(existingSetting).subscribe(() => {
          this.sellPrintForm.patchValue(existingSetting);
        });
        this.app.noty.notifyUpdated('Sell print Setting has been');
      } else {
        // No data exists, add it
        this.settingService
          .addSellPrintSetting(formValue)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.sellPrintForm.patchValue(newSettings);
              this.app.noty.notifyAdded('Sell print Setting has been');
            }
          });
      }
    });
  }

  savedashboardSetting() {
    let formValue = this.dashboardForm.value;
    console.log(formValue);

    // Check if data exists in the storage
    this.settingService.getDashboardSetting().subscribe((settings) => {
      if (settings && settings.id) {
        // Data exists, update it
        let existingSetting = { ...settings, ...formValue };
        this.settingService.dashboardUpdate(existingSetting).subscribe(() => {
          this.dashboardForm.patchValue(existingSetting);
        });
        this.app.noty.notifyUpdated('Dashboard Setting has been');
      } else {
        // No data exists, add it
        this.settingService
          .addDashboardSetting(formValue)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.dashboardForm.patchValue(newSettings);
              this.app.noty.notifyAdded('Dashboard Setting has been');
            }
          });
      }
    });
  }

  downloadUserGuide() {
    let link = document.createElement('a');
    link.href = 'assets/sw/Etrivia Ledger User Guide.pdf';
    link.click();
  }
}
