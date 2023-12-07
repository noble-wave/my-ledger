import { Component, OnDestroy } from '@angular/core';
import { SellService } from '../services/sell.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SellSettings,
  QuickSellSettings,
  getSellSettingMeta,
  getQuickSellSettingMeta,
} from '@app/models/sell-setting.model';
import { ModelMeta } from '@app/shared-services';
import { AppService } from '@app/services/app.service';
import { SettingService } from '../services/setting.service';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


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
  sellSetting: any = { manageSellStatus: true };
  quicksellSetting: any = { manageQuickSell: false };

  unitPrices: Array<number> = [];

  constructor(
    private sellService: SellService,
    private app: AppService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.fragment.subscribe(fragment => {
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

      // this.quickSellForm = this.fb.group({
      //   manageQuickSell: [true], // Your other controls here
      //   unitPrices: this.fb.array([]), // Initialize unitPrices as an empty FormArray
      // });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  private scrollToElement(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
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
    const unitPricesFormArray = this.quickSellForm.get('unitPrices') as FormArray;
    unitPricesFormArray.push(this.fb.control(''));
  }
  

  saveQuickSellSetting() {
    let quickSellSetting = this.quickSellForm.value;
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
        this.app.noty.notifyUpdated('Setting has been');
      } else {
        // No data exists, add it
        this.settingService
          .addQuickSellSetting(quickSellSetting)
          .subscribe((newSettings) => {
            if (newSettings) {
              this.form.patchValue(newSettings);
              this.app.noty.notifyAdded('Setting has been');
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
}
