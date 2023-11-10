import {
  SellPayment,
  getSellItemMeta,
  getSellMeta,
  getSellPaymentMeta,
} from '@app/models/sell.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '@app/services/app.service';
import { ModelMeta } from '@app/shared-services';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
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
  SellPaymentMeta: ModelMeta[];
  customers: Customer[];
  products: Product[];
  statusOption: any;
  setting: any;
  showDetails: boolean = false;
  amountPaid: number = 0;
  showAmountPaidAndBalanceDue: boolean = false;

  constructor(
    private sellService: SellService,
    private customerService: CustomerService,
    private productService: ProductService,
    private app: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingService,
    private dialog: MatDialog
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

    this.SellPaymentMeta = getSellPaymentMeta();
    this.sellPaymentForm = this.app.meta.toFormGroup({}, this.SellPaymentMeta);

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

  toggleDetails() {
    this.showDetails = !this.showDetails;
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
      this.calculateTotalQuantity();
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
      form.get('customerName')?.setValue('');
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

  calculateTotalQuantity(): number {
    let totalQuantity = 0;
    for (const sellItemForm of this.sellItemForms) {
      if (sellItemForm && sellItemForm.get('quantity')) {
        const quantity = sellItemForm.get('quantity')?.value || 0;
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

  calculateBalanceDue(): number {
    const netAmount = this.calculateNetAmount();
    const balanceDue = netAmount - this.amountPaid;

    this.form.get('dueAmount')?.setValue(balanceDue);

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
    this.calculateTotalQuantity();
  }

  deleteItem(index: number) {
    this.sellItemForms.splice(index, 1);
    this.calculateNetAmount(); // Recalculate total amount
  }

  saveSell2() {
    let sell = this.form.value;
    let sellPayment = this.sellPaymentForm.value;
    let sellItems = this.sellItemForms.map((x) => x.value);
    sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory
    this.sellService.addSell(sell).subscribe((x) => {
      console.log(x);
      let sellId;
      sellId = x.sellId
      if (this.showAmountPaidAndBalanceDue === true) {
        let paymentDate;
        paymentDate = new Date();
        this.sellService.addSellPayment(sellPayment, sellId, x.customerId, paymentDate).subscribe((y) => {
          console.log('payment Saved',y);
        });
      }
      this.app.noty.notifyClose('Sell has been taken');
      this.form.reset();
      this.sellPaymentForm.reset();
      this.resetSellItemForms();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity();
      this.amountPaid = 0;
      this.calculateBalanceDue();
    });
  }

  saveSell() {
    let sell = this.form.value;
    let sellPayment: SellPayment; 
    let sellItems = this.sellItemForms.map((x) => x.value);
    sell.items = sellItems;
  
    this.productService.updateProductInventory(sellItems); // Update product inventory
  
    this.sellService.addSell(sell).subscribe((x) => {
      console.log(x);
      let sellId = x.sellId;
      let customerId = x.customerId ;
  
      if (this.showAmountPaidAndBalanceDue === true) {
        let paymentDate = new Date(); 
        let paymentId = `custom_payment_id`; 
  
        sellPayment = {
          paymentId: paymentId,
          sellId: sellId,
          customerId: customerId,
          amountPaid: this.amountPaid, 
          paymentDate: paymentDate
        };
        this.sellService.addSellPayment1(sellPayment).subscribe((y) => {
          console.log('Payment Saved', y);
        });
      }
  
      this.app.noty.notifyClose('Sell has been taken');
      this.form.reset();
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setValue(null);
        this.form.get(key)?.setErrors(null);
      });
      this.sellPaymentForm.reset();
      this.resetSellItemForms();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity();
      this.amountPaid = 0;
      this.calculateBalanceDue();
    });
  }

  resetSellItemForms() {
    for (const sellItemForm of this.sellItemForms) {
      sellItemForm.reset();
    }
  }

  saveSellPrint() {
    let sell = this.form.value;
    let sellItems = this.sellItemForms.map((x) => x.value);
    sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory
    this.sellService.addSell(sell).subscribe((x) => {
      console.log(x);
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
