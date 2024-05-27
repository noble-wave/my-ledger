import {
  SellPayment,
  Wallet,
  WalletHistory,
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
import { WalletService } from '../services/wallet.service';

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
  balanceDue: number = 0;
  amountPaid: number = 0;
  showAmountPaidAndBalanceDue: boolean = false;
  advanceAndBalanceDue: boolean = false;
  selectedCustomerId: any;
  selectCustomerWallet: undefined | Wallet;
  selectCustomerWalletAmount: number;
  iswalletActive: boolean = false;
  newAmountPaid: number = 0;
  newAmountFrom: FormGroup;
  walletInput: number = 0;

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
    private location: Location,
    private walletService: WalletService,
    private fb: FormBuilder
  ) {
    this.newAmountFrom = this.fb.group({
      netAmount: [''],
    });
  }

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
    this.sellPaymentForm = this.app.meta.toFormGroup(
      { amountPaid: 0 },
      this.sellPaymentMeta
    );

    this.customerService.getAll().subscribe((customers) => {
      this.customers = customers;
    });

    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });

    this.statusOption = this.sellService.getStatusOptions();

    this.settingService.getSellSetting().subscribe((sellSettings) => {
      this.setting = { ...sellSettings };
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

  handleRandomCustomerName(customer: string, form: FormGroup) {
    form.get('customerName')?.setValue(customer);
  }

  handleCustomerSelection(customer: Customer, form: FormGroup) {
    if (customer) {
      form.get('customerName')?.setValue(customer.customerName);
      this.showAmountPaidAndBalanceDue = true;
      this.selectedCustomerId = customer.customerId;
      this.walletService
        .getWalletByCustomerId(this.selectedCustomerId)
        .subscribe((x) => {
          this.selectCustomerWallet = x;
          this.selectCustomerWalletAmount = x.walletAmount;
        });
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
    let netAmount: number = 0;
    for (const sellItemForm of this.sellItemForms) {
      if (sellItemForm && sellItemForm.get('subtotal')) {
        const subtotal = sellItemForm.get('subtotal')?.value || 0;
        netAmount += subtotal;
      }
    }
    const netAmountControl = this.form.get('netAmount');
    if (netAmountControl && netAmountControl.value !== netAmount) {
      netAmountControl.setValue(netAmount, { emitEvent: false });
      this.sellPaymentForm.get('amountPaid')?.setValue(netAmount);
    }
    return netAmount;
  }

  calculateTotalDiscount(): number {
    const grossAmount = this.calculateGrossAmount();
    const netAmount = this.calculateNetAmount();
    const totalDiscount = grossAmount - netAmount;

    // this.form.get('totalDiscount')?.setValue(totalDiscount);
    const totalDiscountControl = this.form.get('totalDiscount');
    if (totalDiscountControl && totalDiscountControl.value !== totalDiscount) {
      totalDiscountControl.setValue(totalDiscount, { emitEvent: false });
    }
    return totalDiscount;
  }

  calculateBalanceDue(): number {
    const netAmount = this.calculateNetAmount();
    this.balanceDue = netAmount - this.amountPaid;

    if (
      this.showAmountPaidAndBalanceDue === true &&
      this.amountPaid <= netAmount
    ) {
      this.form.get('dueAmount')?.setValue(this.balanceDue);
      this.advanceAndBalanceDue = false;
    } else {
      this.form.get('dueAmount')?.setValue(0);
      this.advanceAndBalanceDue = true;
      return Math.abs(this.balanceDue);
    }
    return this.balanceDue;
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

    if (!this.updateWallet()) {
      return;
    }

    let sell = this.form.value;
    let sellPayment: SellPayment;
    let wallet: Wallet;
    let walletHistory: WalletHistory;
    let sellItems = this.sellItemForms.map((x) => x.value);
    // sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory

    this.sellService.addSell(sell).subscribe((x) => {
      let sellId = x.sellId;
      let customerId = x.customerId;

      sellItems.forEach((sellItem) => {
        sellItem.sellId = sellId;
        sellItem.sellDate = new Date();
      });

      this.sellService.addSellItems(sellItems).subscribe();

      if (this.showAmountPaidAndBalanceDue === true) {
        let validAmountPaid = this.form.get('netAmount')?.value;
        let amount = Number(this.amountPaid);
        if (amount <= validAmountPaid) {
          let paymentDate = new Date();
          let paymentId = `custom_payment_id`;
          sellPayment = {
            paymentId: paymentId,
            sellId: sellId,
            customerId: customerId,
            amountPaid: this.amountPaid,
            paymentDate: paymentDate,
          };
          this.sellService.addSellPayment1(sellPayment)?.subscribe();
        } else if (amount > validAmountPaid) {
          let extraAmount = amount - validAmountPaid;
          let walletId;
          let paymentDate = new Date();
          let paymentId = `custom_payment_id`;
          sellPayment = {
            paymentId: paymentId,
            sellId: sellId,
            customerId: customerId,
            amountPaid: validAmountPaid,
            paymentDate: paymentDate,
          };
          this.sellService.addSellPayment1(sellPayment)?.subscribe();
          let walletDescription = 'From Sell';
          this.walletService
            .getWalletByCustomerId(customerId)
            .subscribe((customerWallet) => {
              if (customerWallet) {
                let updateWallet = {
                  walletId: customerWallet.walletId,
                  customerId: customerWallet.customerId,
                  walletAmount: customerWallet.walletAmount + extraAmount,
                  createdAt: customerWallet.createdAt,
                  description: walletDescription,
                };
                this.walletService
                  .updateWallet(updateWallet)
                  .subscribe((result) => {
                    walletHistory = {
                      customerId: customerId,
                      walletId: result.walletId,
                      walletAmount: extraAmount,
                      description: walletDescription,
                    };
                    this.walletService
                      .addWalletHistory(walletHistory)
                      .subscribe();
                  });
              } else {
                wallet = {
                  customerId: customerId,
                  walletAmount: extraAmount,
                };

                this.walletService
                  .addWallet(wallet)
                  .subscribe((resultWallet) => {
                    walletId = resultWallet.walletId;
                    walletHistory = {
                      customerId: customerId,
                      walletId: walletId,
                      walletAmount: extraAmount,
                      description: walletDescription,
                    };
                    this.walletService
                      .addWalletHistory(walletHistory)
                      .subscribe();
                  });
              }
            });

          // this.app.noty.notifyLocalValidationError(
          //   'Amount paid exceeds net amount'
          // );
          // return;
        }
        // this.updateWallet();
      }

      this.app.noty.notifyClose('Sell has been taken');
      this.refreshing = true;
      this.cdr.detectChanges();
      this.resetSellItemForms();
      this.amountPaid = 0;
      this.sellPaymentForm.reset();
      this.refreshing = false;
      this.showAmountPaidAndBalanceDue = false;
      this.cdr.detectChanges();
      this.newAmountPaid = 0;
    });
  }

  resetSellItemForms() {
    this.sellItemForms = [];
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

    if (!this.updateWallet()) {
      return;
    }

    let sell = this.form.value;
    let sellPayment: SellPayment;
    let wallet: Wallet;
    let walletHistory: WalletHistory;
    let sellItems = this.sellItemForms.map((x) => x.value);
    // sell.items = sellItems;
    this.productService.updateProductInventory(sellItems); // Update product inventory

    this.sellService.addSell(sell).subscribe((x) => {
      let sellId = x.sellId;
      let customerId = x.customerId;

      sellItems.forEach((sellItem) => {
        sellItem.sellId = sellId;
        sellItem.sellDate = new Date();
      });

      this.sellService.addSellItems(sellItems).subscribe();

      if (this.showAmountPaidAndBalanceDue === true) {
        let validAmountPaid = this.form.get('netAmount')?.value;
        let amount = Number(this.amountPaid);
        if (amount <= validAmountPaid) {
          let paymentDate = new Date();
          let paymentId = `custom_payment_id`;
          sellPayment = {
            paymentId: paymentId,
            sellId: sellId,
            customerId: customerId,
            amountPaid: this.amountPaid,
            paymentDate: paymentDate,
          };
          this.sellService.addSellPayment1(sellPayment)?.subscribe();
        } else if (amount > validAmountPaid) {
          let extraAmount = amount - validAmountPaid;
          let walletId;
          let paymentDate = new Date();
          let paymentId = `custom_payment_id`;
          sellPayment = {
            paymentId: paymentId,
            sellId: sellId,
            customerId: customerId,
            amountPaid: validAmountPaid,
            paymentDate: paymentDate,
          };
          this.sellService.addSellPayment1(sellPayment)?.subscribe();

          let walletDescription = 'From Sell';

          this.walletService
            .getWalletByCustomerId(customerId)
            .subscribe((customerWallet) => {
              if (customerWallet) {
                let updateWallet = {
                  walletId: customerWallet.walletId,
                  customerId: customerWallet.customerId,
                  walletAmount: customerWallet.walletAmount + extraAmount,
                  createdAt: customerWallet.createdAt,
                  description: walletDescription,
                };
                this.walletService
                  .updateWallet(updateWallet)
                  .subscribe((result) => {
                    walletHistory = {
                      customerId: customerId,
                      walletId: result.walletId,
                      walletAmount: extraAmount,
                      description: walletDescription,
                    };
                    this.walletService
                      .addWalletHistory(walletHistory)
                      .subscribe();
                  });
              } else {
                wallet = {
                  customerId: customerId,
                  walletAmount: extraAmount,
                };

                this.walletService
                  .addWallet(wallet)
                  .subscribe((resultWallet) => {
                    walletId = resultWallet.walletId;
                    walletHistory = {
                      customerId: customerId,
                      walletId: walletId,
                      walletAmount: extraAmount,
                      description: walletDescription,
                    };
                    this.walletService
                      .addWalletHistory(walletHistory)
                      .subscribe();
                  });
              }
            });

          // this.app.noty.notifyLocalValidationError(
          //   'Amount paid exceeds net amount'
          // );
          // return;
        }
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

  handleWallet(event: any, walletAmount: number) {
    this.iswalletActive = event;
    if (this.iswalletActive === true) {
      let netAmount = Number(this.form.get('netAmount')?.value);
      let newWalletAmount = netAmount - walletAmount;
      if (newWalletAmount < 0) {
        this.newAmountPaid = 0;
        this.walletInput = 0;
      } else if (newWalletAmount === 0) {
        this.newAmountPaid = 0;
        this.walletInput = 0;
      } else if (newWalletAmount > 0) {
        this.newAmountPaid = newWalletAmount;
        this.walletInput = newWalletAmount;
      }
    } else {
      console.log('revert');
      this.newAmountPaid = 0;
    }
  }

  walletAmount(query: KeyboardEvent) {
    let wallet = this.selectCustomerWallet?.walletAmount ?? 0;
    let netAmount = Number(this.form.get('netAmount')?.value);
    if (query) {
      const element = query.target as HTMLInputElement;
      let amount = Number(element.value);
      // if (netAmount > amount) {
      this.amountPaid = wallet + amount;
      this.sellPaymentForm.get('amountPaid')?.setValue(this.amountPaid);
      this.calculateBalanceDue();
      // }
    }
  }

  updateWallet() {
    let walletAmount = this.selectCustomerWallet?.walletAmount ?? 0;
    if (this.iswalletActive === true) {
      let netAmount = Number(this.form.get('netAmount')?.value);
      let newWalletAmount = netAmount - walletAmount;
      if (newWalletAmount < 0) {
        this.newAmountPaid = 0;
        let x = Math.abs(newWalletAmount);
        let y = Number(walletAmount + newWalletAmount);
        let walletHistoryAmount = -Math.abs(y);
        this.updateWalletAmount(x, walletHistoryAmount);
        return true;
      } else if (newWalletAmount === 0) {
        this.newAmountPaid = 0;
        let walletHistoryAmount = -Math.abs(walletAmount);
        this.updateWalletAmount(0, walletHistoryAmount);
        return true;
      } else if (newWalletAmount > 0) {
        this.app.noty.notifyLocalValidationError(
          'Please enter a value less than or equal to amount to pay'
        );
        return false;
      }
    } else {
      console.log('revert');
      this.newAmountPaid = 0;
      return true;
    }

    // Add a return statement to ensure all code paths return a value
    return false;
  }

  updateWalletAmount(amount: number, walletHistoryAmount: number) {
    this.walletService
      .getWalletByCustomerId(this.selectedCustomerId)
      .subscribe((res) => {
        if (res) {
          let updateWallet = {
            walletId: res.walletId,
            customerId: res.customerId,
            walletAmount: amount,
            createdAt: res.createdAt,
          };
          this.walletService.updateWallet(updateWallet).subscribe((result) => {
            let walletHistory;
            walletHistory = {
              customerId: res.customerId,
              walletId: result.walletId,
              walletAmount: walletHistoryAmount,
              description: 'Updated form sell',
            };
            this.walletService.addWalletHistory(walletHistory).subscribe(() => {
              this.app.noty.notifyClose('Wallet amount has been updated.');
            });
          });
        } else {
          this.app.noty.notifyLocalValidationError('');
        }
      });
  }
}
