import {
  SellPayment,
  getSellItemMeta,
  getSellMeta,
  getSellPaymentMeta,
} from '@app/models/sell.model';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppService } from '@app/services/app.service';
import { ModelMeta } from '@app/shared-services';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SellService } from '../services/sell.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Product } from '@app/models/product.model';
import { Customer } from '@app/models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../services/setting.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerComponent } from '../customer/customer.component';
import { ProductComponent } from '../product/product.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
})
export class SellComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  form: FormGroup;
  sellItemForms: FormGroup[];
  sellPaymentForm: FormGroup;
  modelMeta: ModelMeta[];
  sellItemMeta: ModelMeta[];
  sellPaymentMeta: ModelMeta[];
  customers: Customer[];
  products: Product[];
  statusOption: any;
  setting: any;
  refreshing: boolean;
  amountPaid: number = 0;
  showAmountPaidAndBalanceDue: boolean = false;

  constructor(
    private sellService: SellService,
    private customerService: CustomerService,
    private productService: ProductService,
    private app: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private settingService: SettingService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.modelMeta = getSellMeta();
    this.form = this.app.meta.toFormGroup(
      { sellDate: new Date() },
      this.modelMeta
    );

    this.sellItemMeta = getSellItemMeta();
    this.sellItemForms = [];
    this.sellItemForms.push(this.app.meta.toFormGroup({}, this.sellItemMeta));

    this.sellPaymentMeta = getSellPaymentMeta();
    this.sellPaymentForm = this.app.meta.toFormGroup({}, this.sellPaymentMeta);

    this.customerService.getAll().subscribe((customers) => {
      this.customers = customers;
    });

    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });

    this.statusOption = this.sellService.getStatusOptions();

    this.settingService.getSellSetting().subscribe((sellSettings) => {
      this.setting = { ...sellSettings };
      console.log('Setting data:', this.setting);
      let defaultSellStatus = sellSettings.defaultSellStatus;
      this.form.get('status')?.setValue(defaultSellStatus);
    });
  }

  resetOnSave() {
    this.modelMeta = getSellMeta();
    this.form = this.app.meta.toFormGroup(
      { sellDate: new Date() },
      this.modelMeta
    );
  }

  settings() {
    this.router.navigate(['/setting']);
  }

  navigateBack() {
    this.location.back();
  }

  handleRandomProductName(productName: string, sellItemForm: FormGroup) {
    sellItemForm.get('productName')?.setValue(productName);
  }

  handleProductSelection(product: Product, sellItemForm: FormGroup) {
    sellItemForm.get('productName')?.setValue(product.productName);
    sellItemForm.get('unitPrice')?.setValue(product.price);

    // Set the initial quantity to 1
    const quantityControl = sellItemForm.get('quantity');
    const unitPriceControl = sellItemForm.get('unitPrice');
    const discountControl = sellItemForm.get('discount');

    if (quantityControl && unitPriceControl && discountControl) {
      quantityControl.setValue(1); // Set quantity to 1
      unitPriceControl.setValue(product.price); // Set unitPrice to the product's price
      discountControl.setValue(0); // Set discount to zero

      // Calculate the subtotal directly
      const quantity = quantityControl.value || 0;
      const unitPrice = unitPriceControl.value || 0;
      const discount = discountControl.value || 0;
      const subtotal = (unitPrice - discount) * quantity;
      sellItemForm.get('subtotal')?.setValue(subtotal);
    }
  }

  updateSubtotal(sellItemForm: FormGroup) {
    const quantity = sellItemForm.get('quantity')?.value;
    const unitPrice = sellItemForm.get('unitPrice')?.value;
    const discount = sellItemForm.get('discount')?.value;
    const newUnitPrice = parseFloat(unitPrice);
    const newDiscount = parseFloat(discount) || 0;

    if (!isNaN(newUnitPrice) && quantity !== undefined) {
      const subtotal = (newUnitPrice - newDiscount) * quantity;
      sellItemForm.get('subtotal')?.setValue(subtotal);

      this.calculateTotalDiscount();
      this.calculateTotalDiscount();
      this.calculateNetAmount();
      this.calculateBalanceDue();
    }
  }

  handleRandomCustomerName(customer: Customer, form: FormGroup) {
    form.get('customerName')?.setValue(customer);
  }

  handleCustomerSelection(customer: Customer, form: FormGroup) {
    console.log('Selected customer:', customer);
    if (customer) {
      form.get('customerName')?.setValue(customer.customerName);
      this.showAmountPaidAndBalanceDue = true;
    } else {
      this.showAmountPaidAndBalanceDue = false;
    }
  }

  getProductDefaultPrice(sellItemForm: FormGroup): number {
    const productId = sellItemForm.get('productId')?.value;
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
    for (const sellItemForm of this.sellItemForms) {
      if (sellItemForm instanceof FormGroup) {
        const quantity = sellItemForm.get('quantity')?.value || 0;
        const unitPrice = sellItemForm.get('unitPrice')?.value || 0;
        grossAmount += quantity * unitPrice;
      }
    }
    this.form.get('grossAmount')?.setValue(grossAmount);
    return grossAmount;
  }

  calculateNetAmount(): number {
    let netAmount = 0;
    for (const sellItemForm of this.sellItemForms) {
      if (sellItemForm && sellItemForm.get('subtotal')) {
        const subtotal = sellItemForm.get('subtotal')?.value || 0;
        netAmount += subtotal;
      }
    }
    this.form.get('netAmount')?.setValue(netAmount);
    return netAmount;
  }

  calculateTotalDiscount(): number {
    const grossAmount = this.calculateGrossAmount();
    const netAmount = this.calculateNetAmount();
    const totalDiscount = grossAmount - netAmount;

    this.form.get('totalDiscount')?.setValue(totalDiscount);
    return totalDiscount;
  }

  calculateBalanceDue(): number {
    const netAmount = this.calculateNetAmount();
    const balanceDue = netAmount - this.amountPaid;
    
    if (this.showAmountPaidAndBalanceDue === true) {
      this.form.get('dueAmount')?.setValue(balanceDue);
    }
    else {
      this.form.get('dueAmount')?.setValue(0);
  }
    return balanceDue;
  }

  valueChanged(amountPaid: number) {
    this.amountPaid = amountPaid;
    this.calculateBalanceDue();
  }

  addItem() {
    const newSellItemForm = new FormGroup({
      productId: new FormControl(''),
      productName: new FormControl(''),
      quantity: new FormControl(''),
      unitPrice: new FormControl(''),
      discount: new FormControl(''),
      subtotal: new FormControl(''),
    });

    this.sellItemForms.push(newSellItemForm);
    this.calculateGrossAmount();
    this.calculateTotalDiscount();
    this.calculateNetAmount();
    this.calculateBalanceDue();
  }

  deleteItem(index: number) {
    this.sellItemForms.splice(index, 1);
    this.calculateNetAmount(); // Recalculate total amount
  }

  saveSell() {
    const hasValidSellItem = this.sellItemForms.some((sellItemForm) => {
      const unitPrice = sellItemForm.get('unitPrice')?.value;
      const quantity = sellItemForm.get('quantity')?.value;
      return !!unitPrice && !!quantity;
    });

    if (!hasValidSellItem) {
      this.app.noty.notifyLocalValidationError('');
      return;
    }

    let sell = this.form.value;
    let sellPayment: SellPayment;
    let sellItems = this.sellItemForms.map((x) => x.value);
    // sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory

    this.sellService.addSell(sell).subscribe((x) => {
      console.log(x);
      let sellId = x.sellId;
      let customerId = x.customerId;

      sellItems.forEach((sellItem) => {
        sellItem.sellId = sellId;
      });

      this.sellService.addSellItems(sellItems).subscribe((z) => {
        // console.log(z);
      });

      if (this.showAmountPaidAndBalanceDue === true) {
        let paymentDate = new Date();
        let paymentId = `custom_payment_id`;
        sellPayment = {
          paymentId: paymentId,
          sellId: sellId,
          customerId: customerId,
          amountPaid: this.amountPaid,
          paymentDate: paymentDate,
        };
        this.sellService.addSellPayment1(sellPayment)?.subscribe((y) => {
          console.log('Payment Saved', y);
        });
      }

      this.app.noty.notifyClose('Sell has been taken');
      console.log('Before reset:', this.form.value);
      console.log('After reset:', this.form.value);
      // this.router.navigate([], {queryParams: {time: new Date()}})
      this.refreshing = true;
      this.cdr.detectChanges();
      this.resetSellItemForms();
      this.amountPaid = 0;
      this.sellPaymentForm.reset();
      this.refreshing = false;
      this.cdr.detectChanges();
    });
  }

  resetSellItemForms() {
    // this.form = this.app.meta.toFormGroup({ sellDate: new Date(), status: this.setting.defaultSellStatus }, this.modelMeta);
    this.sellItemForms = [];
    // this.form.reset();
    this.sellItemForms.push(this.app.meta.toFormGroup({}, this.sellItemMeta));

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this.form.reset({
      sellDate: new Date(),
      status: this.setting.defaultSellStatus,
    });
  }

  saveSellPrint() {
    const hasValidSellItem = this.sellItemForms.some((sellItemForm) => {
      const unitPrice = sellItemForm.get('unitPrice')?.value;
      const quantity = sellItemForm.get('quantity')?.value;
      return !!unitPrice && !!quantity;
    });

    if (!hasValidSellItem) {
      this.app.noty.notifyLocalValidationError('');
      return;
    }
    let sell = this.form.value;
    let sellPayment: SellPayment;
    let sellItems = this.sellItemForms.map((x) => x.value);
    // sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory
    this.sellService.addSell(sell).subscribe((x) => {
      console.log(x);
      let sellId = x.sellId;
      let customerId = x.customerId;

      sellItems.forEach((sellItem) => {
        sellItem.sellId = sellId;
      });

      this.sellService.addSellItems(sellItems).subscribe((z) => {
        // console.log(z);
      });

      if (this.showAmountPaidAndBalanceDue === true) {
        let paymentDate = new Date();
        let paymentId = `custom_payment_id`;
        sellPayment = {
          paymentId: paymentId,
          sellId: sellId,
          customerId: customerId,
          amountPaid: this.amountPaid,
          paymentDate: paymentDate,
        };
        this.sellService.addSellPayment1(sellPayment)?.subscribe((y) => {
          console.log('Payment Saved', y);
        });
      }
      this.app.noty.notifyClose('Sell has been taken and go to print');
      this.router.navigate(['/sell/view', x.sellId], {
        relativeTo: this.route,
        queryParams: { print: true },
      });
    });
  }

  openAddCustomerDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(CustomerComponent, {
      width: '400px', // Adjust the width as needed
      height: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.customerService.getAll().subscribe((customers) => {
        this.customers = customers;
      });
      if (result) {
        console.log('Customer data:', result);
      }
    });
  }

  openAddProductDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(ProductComponent, {
      width: '400px', // Adjust the width as needed
      enterAnimationDuration,
      exitAnimationDuration,
      data: { isDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.productService.getAll().subscribe((products) => {
        this.products = products;
      });
      if (result) {
        console.log('Product data:', result);
      }
    });
  }

  getDiscountPercentage(sellItemForm: FormGroup): string {
    const unitPrice = sellItemForm.get('unitPrice')?.value;
    const discount = sellItemForm.get('discount')?.value;
    const newUnitPrice = parseFloat(unitPrice);
    const newDiscount = parseFloat(discount) || 0;

    if (!isNaN(newUnitPrice)) {
      let calculatedPercentage = (newDiscount / newUnitPrice) * 100;
      let calculatedPercentageDigit = calculatedPercentage.toFixed(1);
      return `${calculatedPercentageDigit}%`;
    }
    return '0%';
  }

  openUpdateProductDialog1(sellItemForm: FormGroup) {
    const controlValue = sellItemForm.get('productId')?.value;

    if (controlValue) {
      this.router.navigate(['../', 'product', controlValue]);
    }
  }
  openUpdateProductDialog(sellItemForm: FormGroup) {
    const controlValue = sellItemForm.get('productId')?.value;

    if (controlValue) {
      const dialogRef = this.dialog.open(ProductComponent, {
        width: '400px',
        data: { isDialog: 'true', productId: controlValue },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
}

//decrypted Function
// getProductQuantity(sellItemForm: FormGroup): string {
//   let productId = sellItemForm.get('productId')?.value;

//   if (productId) {
//     this.productService.getProductInventory(productId).subscribe((x) => {
//       let productCount = x.count;
//       console.log(productCount);
//       return `${productCount}`;
//     });
//   }
//   return '0';
// }
