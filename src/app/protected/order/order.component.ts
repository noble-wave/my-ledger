import { getOrderItemMeta, getOrderMeta } from '@app/models/order.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '@app/services/app.service';
import { ModelMeta } from '@app/shared-services';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Product } from '@app/models/product.model';
import { Customer } from '@app/models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  form: FormGroup;
  orderItemForms: FormGroup[];
  modelMeta: ModelMeta[];
  orderItemMeta: ModelMeta[];
  customers: Customer[];
  products: Product[];
  statusOption: any;
  setting: any;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private app: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.modelMeta = getOrderMeta();
    this.form = this.app.meta.toFormGroup(
      { orderDate: new Date() },
      this.modelMeta
    );

    this.orderItemMeta = getOrderItemMeta();
    this.orderItemForms = [];
    this.orderItemForms.push(this.app.meta.toFormGroup({}, this.orderItemMeta));

    this.customerService.getAll().subscribe((customers) => {
      this.customers = customers;
    });

    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });

    this.statusOption = this.orderService.getStatusOptions();

    this.settingService.getOrderSetting().subscribe((orderSettings) => {
      this.setting = { ...orderSettings };
      console.log('Setting data:', this.setting);
      let defaultOrderStatus = orderSettings.defaultOrderStatus;
      this.form.get('status')?.setValue(defaultOrderStatus);
    });
  }

  handleProductSelection(product: Product, orderItemForm: FormGroup) {
    orderItemForm.get('productName')?.setValue(product.productName);
    orderItemForm.get('unitPrice')?.setValue(product.price);

    // Set the initial quantity to 1
    const quantityControl = orderItemForm.get('quantity');
    const unitPriceControl = orderItemForm.get('unitPrice');
    const discountControl = orderItemForm.get('discount');

    if (quantityControl && unitPriceControl && discountControl) {
      quantityControl.setValue(1); // Set quantity to 1
      unitPriceControl.setValue(product.price); // Set unitPrice to the product's price
      discountControl.setValue(0); // Set discount to zero

      // Calculate the subtotal directly
      const quantity = quantityControl.value || 0;
      const unitPrice = unitPriceControl.value || 0;
      const discount = discountControl.value || 0;
      const subtotal = (unitPrice - discount) * quantity;
      orderItemForm.get('subtotal')?.setValue(subtotal);
    }
  }

  updateSubtotal(orderItemForm: FormGroup) {
    const quantity = orderItemForm.get('quantity')?.value;
    const unitPrice = orderItemForm.get('unitPrice')?.value;
    const discount = orderItemForm.get('discount')?.value;
    const newUnitPrice = parseFloat(unitPrice); // Convert value to a floating-point number
    const newDiscount = parseFloat(discount) || 0; // Convert value to a floating-point number

    if (!isNaN(newUnitPrice) && quantity !== undefined) {
      const subtotal = (newUnitPrice - newDiscount) * quantity; // Calculate the new subtotal
      orderItemForm.get('subtotal')?.setValue(subtotal);
      this.calculateGrossAmount(); // Recalculate total amount
      this.calculateTotalDiscount();
      this.calculateNetAmount();
      this.calculateTotalQuantity();
    }
  }

  handleCustomerSelection(customer: Customer) {
    console.log('Selected customer:', customer);
    this.form.get('customerName')?.setValue(customer.customerName);
  }

  getProductDefaultPrice(orderItemForm: FormGroup): number {
    const productId = orderItemForm.get('productId')?.value;
    if (productId) {
      const selectedProduct = this.products.find(
        (product) => product.productId === productId
      );
      return selectedProduct && selectedProduct.price !== undefined
        ? selectedProduct.price
        : 0;
    }
    return 0;
  }

  calculateGrossAmount(): number {
    let grossAmount = 0;
    for (const orderItemForm of this.orderItemForms) {
      if (orderItemForm instanceof FormGroup) {
        const quantity = orderItemForm.get('quantity')?.value || 0;
        const unitPrice = orderItemForm.get('unitPrice')?.value || 0;
        grossAmount += quantity * unitPrice;
      }
    }
    this.form.get('grossAmount')?.setValue(grossAmount);
    return grossAmount;
  }

  calculateNetAmount(): number {
    let netAmount = 0;
    for (const orderItemForm of this.orderItemForms) {
      if (orderItemForm && orderItemForm.get('subtotal')) {
        const subtotal = orderItemForm.get('subtotal')?.value || 0;
        netAmount += subtotal;
      }
    }
    this.form.get('netAmount')?.setValue(netAmount);
    return netAmount;
  }

  calculateTotalQuantity(): number {
    let totalQuantity = 0;
    for (const orderItemForm of this.orderItemForms) {
      if (orderItemForm && orderItemForm.get('quantity')) {
        const quantity = orderItemForm.get('quantity')?.value || 0;
        totalQuantity += Number(quantity);
      }
    }
    this.form.get('totalQuantity')?.setValue(totalQuantity); 
    return totalQuantity;
  }
  
  calculateTotalDiscount(): number {
    const grossAmount = this.calculateGrossAmount();
    const netAmount = this.calculateNetAmount();
    const totalDiscount = grossAmount - netAmount;

    this.form.get('totalDiscount')?.setValue(totalDiscount);
    return totalDiscount;
  }

  addItem() {
    const newOrderItemForm = new FormGroup({
      productId: new FormControl(''),
      productName: new FormControl(''),
      quantity: new FormControl(''),
      unitPrice: new FormControl(''),
      discount: new FormControl(''),
      subtotal: new FormControl(''),
    });

    this.orderItemForms.push(newOrderItemForm);
    this.calculateGrossAmount();
    this.calculateTotalDiscount();
    this.calculateNetAmount();
    this.calculateTotalQuantity();
  }

  deleteItem(index: number) {
    this.orderItemForms.splice(index, 1);
    this.calculateNetAmount(); // Recalculate total amount
  }

  saveOrder() {
    let order = this.form.value;
    let orderItems = this.orderItemForms.map((x) => x.value);
    order.items = orderItems;
    this.productService.updateProductInventory(orderItems); // Update product inventory
    this.orderService.addOrder(order).subscribe((x) => {
      console.log(x);
      this.app.noty.notifyClose('Order has been taken');
      this.form.reset();
      this.resetOrderItemForms();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity();
    });
  }

  resetOrderItemForms() {
    for (const orderItemForm of this.orderItemForms) {
      orderItemForm.reset();
    }
  }

  saveOrderPrint() {
    let order = this.form.value;
    let orderItems = this.orderItemForms.map((x) => x.value);
    order.items = orderItems;
    this.productService.updateProductInventory(orderItems); // Update product inventory
    this.orderService.addOrder(order).subscribe((x) => {
      console.log(x);
      this.app.noty.notifyClose('Order has been taken and go to print');
      this.router.navigate(['/order/view', x.orderId], {
        relativeTo: this.route,
        queryParams: { print: true },
      });
    });
  }
}
