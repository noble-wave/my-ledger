import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getSellItemMeta, getSellMeta } from '@app/models/sell.model';
import { SellService } from '@app/protected/services/sell.service';
import { SettingService } from '@app/protected/services/setting.service';
import { AppService } from '@app/services/app.service';
import { ModelMeta } from '@app/shared-services';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-sell',
  templateUrl: './quick-sell.component.html',
  styleUrls: ['./quick-sell.component.scss'],
})
export class QuickSellComponent {
  @ViewChild('quickSellSettingElement', { static: true })
  quickSellSettingElement: ElementRef;

  setting: any;
  hasSeenWelcomeMessage: boolean = false;

  sell: any = {
    customerId: undefined,
    customerName: undefined,
    customerPhoneNumber: undefined,
    items: [
      {
        productId: undefined,
        productName: undefined,
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        subtotal: 0,
        netAmount: 0,
      },
    ],
    grossAmount: 0,
    sellDate: new Date(),
    status: '',
    totalQuantity: 1,
    netAmount: 0,
    totalDiscount: 0,
  };
  form: FormGroup;
  sellItemForms: FormGroup[];
  sellItemMeta: ModelMeta[];

  constructor(
    private settingService: SettingService,
    private sellService: SellService,
    private app: AppService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickSellSetting().subscribe((x) => {
      this.setting = { ...x };

      this.sellItemMeta = getSellItemMeta();
      this.sellItemForms = [];
      this.sellItemForms.push(this.app.meta.toFormGroup({}, this.sellItemMeta));
    });

    this.form = this.formBuilder.group({});

    let hasSeenMessage = localStorage.getItem('hasSeenWelcomeMessage');
    if (hasSeenMessage) {
      this.hasSeenWelcomeMessage = true;
    }
  }

  saveSell(unitPrice: number) {
    this.sell.items[0].unitPrice = unitPrice;
    this.sell.grossAmount = this.sell.items[0].quantity * unitPrice;
    this.sell.netAmount = this.sell.grossAmount;
    this.sell.items[0].subtotal = this.sell.netAmount;
    this.sellService.addSell(this.sell).subscribe(() => {
      this.app.noty.notifyClose('Sells have been taken');
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
      this.hasSeenWelcomeMessage = true;
    });
  }

  saveSelld() {
    let sellItems = this.sellItemForms.map((form) => {
      return {
        unitPrice: form.value.unitPrice,
      };
    });

    // Update each sell item and save it
    for (let i = 0; i < sellItems.length; i++) {
      this.sell.items[i].unitPrice = sellItems[i].unitPrice;
      this.sell.grossAmount =
        this.sell.items[i].quantity * sellItems[i].unitPrice;
      this.sell.netAmount = this.sell.grossAmount;
      this.sell.items[i].subtotal = this.sell.netAmount;

      // Save the individual sell item
      this.sellService.addSell(this.sell).subscribe((response) => {
        console.log(response);
      });
    }

    // Handle additional logic or notifications as needed
    this.app.noty.notifyClose('Sells have been taken');
    // Reset the form and sell item forms
    this.form.reset();
    this.sellItemForms = [this.app.meta.toFormGroup({}, this.sellItemMeta)];
  }

  navigateBack() {
    this.location.back();
  }

  settings() {
    this.router.navigate(['/setting'], {
      fragment: 'quickSellSetting',
    });
  }
}
