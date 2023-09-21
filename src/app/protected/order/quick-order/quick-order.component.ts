import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getOrderItemMeta, getOrderMeta } from '@app/models/order.model';
import { OrderService } from '@app/protected/services/order.service';
import { SettingService } from '@app/protected/services/setting.service';
import { AppService } from '@app/services/app.service';
import { ModelMeta } from '@app/shared-services';

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss'],
})
export class QuickOrderComponent {
  setting: any;
  
  order : any = {
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
  grossAmount:0,
  orderDate: new Date(),
  status: '',
  totalQuantity: 1,
  netAmount: 0,
  totalDiscount: 0,
};
  form: FormGroup;
  orderItemForms: FormGroup[];
  orderItemMeta: ModelMeta[];

  constructor(
    private settingService: SettingService,
    private orderService: OrderService,
    private app: AppService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickOrderSetting().subscribe((x) => {
      this.setting = { ...x };

      this.orderItemMeta = getOrderItemMeta();
      this.orderItemForms = [];
      this.orderItemForms.push(
        this.app.meta.toFormGroup({}, this.orderItemMeta)
      );
    });

    this.form = this.formBuilder.group({});
 
  }

  saveOrder(unitPrice: number) {
    this.order.items[0].unitPrice = unitPrice;
    this.order.grossAmount = this.order.items[0].quantity * unitPrice;
    this.order.netAmount = this.order.grossAmount ;
    this.order.items[0].subtotal = this.order.netAmount;
    this.orderService.addOrder(this.order).subscribe(() => {
    });
  }

  saveOrderd() {
    let orderItems = this.orderItemForms.map((form) => {
      return {
        unitPrice: form.value.unitPrice,
      };
    });
  
    // Update each order item and save it
    for (let i = 0; i < orderItems.length; i++) {
      this.order.items[i].unitPrice = orderItems[i].unitPrice;
      this.order.grossAmount = this.order.items[i].quantity * orderItems[i].unitPrice;
      this.order.netAmount = this.order.grossAmount;
      this.order.items[i].subtotal = this.order.netAmount;
  
      // Save the individual order item
      this.orderService.addOrder(this.order).subscribe((response) => {
        console.log(response);
      });
    }
  
    // Handle additional logic or notifications as needed
    this.app.noty.notifyClose('Orders have been taken');
    // Reset the form and order item forms
    this.form.reset();
    this.orderItemForms = [this.app.meta.toFormGroup({}, this.orderItemMeta)];
  }
  
}
