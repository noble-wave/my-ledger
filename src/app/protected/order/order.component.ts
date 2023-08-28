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

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private fb: FormBuilder,
    private app: AppService
  ) {}

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    // this.destroy$.next();
    // this.destroy$.complete();
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
    console.log('Order Status:', this.statusOption);
  }

  handleProductSelection(product: Product, orderItemForm: FormGroup) {
    orderItemForm.get('productName')?.setValue(product.productName);
    orderItemForm.get('unitPrice')?.setValue(product.price);
  
    // Set the initial quantity to 1 and calculate the initial subtotal
    const quantityControl = orderItemForm.get('quantity');
    if (quantityControl) {
      quantityControl.setValue(1);
      this.updateSubtotal(orderItemForm, product.price); // Calculate initial subtotal
  
      quantityControl.valueChanges.pipe(
        takeUntil(this.destroy$) // Unsubscribe when component is destroyed
      ).subscribe((quantity) => {
        const unitPriceControl = orderItemForm.get('unitPrice');
        if (unitPriceControl) {
          this.updateSubtotal(orderItemForm, unitPriceControl.value);
        }
      });
    }
  
    const unitPriceControl = orderItemForm.get('unitPrice');
    if (unitPriceControl) {
      unitPriceControl.valueChanges.pipe(
        takeUntil(this.destroy$) // Unsubscribe when component is destroyed
      ).subscribe((unitPrice) => {
        this.updateSubtotal(orderItemForm, unitPrice);
      });
    }
  }
  
  
  updateSubtotal(orderItemForm, value) {
    const quantity = orderItemForm.get('quantity')?.value;
    const newUnitPrice = parseFloat(value); // Convert value to a floating-point number
  
    if (!isNaN(newUnitPrice) && quantity !== undefined) {
      const subtotal = newUnitPrice * quantity; // Calculate the new subtotal
      orderItemForm.get('subtotal')?.setValue(subtotal);
      this.calculateTotalAmount(); // Recalculate total amount
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

  calculateTotalAmount(): number {
    let totalAmount = 0;
    for (const orderItemForm of this.orderItemForms) {
      if (orderItemForm && orderItemForm.get('subtotal')) {
        const subtotal = orderItemForm.get('subtotal')?.value || 0;
        totalAmount += subtotal;
      }
    }
    this.form.get('totalAmount')?.setValue(totalAmount);
    return totalAmount;
  }

  addItem() {
    const newOrderItemForm = new FormGroup({
      productId: new FormControl(''),
      quantity: new FormControl(''),
      unitPrice: new FormControl(''),
      subtotal: new FormControl(''),
    });

    this.orderItemForms.push(newOrderItemForm);
    this.calculateTotalAmount();
  }

  deleteItem(index: number) {
    this.orderItemForms.splice(index, 1);
    this.calculateTotalAmount(); // Recalculate total amount
  }

  saveOrder() {
    let order = this.form.value;
    let orderItems = this.orderItemForms.map((x) => x.value);
    order.items = orderItems;
    this.productService.updateProductInventory(orderItems); // Update product inventory
    this.orderService.addOrder(order).subscribe((x) => {
      console.log(x);
    });
  }
}
//   saveOrder() {
//     const order: Order = {
//       orderNumber: generateOrderNumber(), // Replace with your logic
//       customerId: this.form.get('customerId')?.value,
//       customerName: this.form.get('customerName')?.value, // Assuming you have a customerName form control
//       items: this.orderItemForms.map(itemForm => itemForm.value),
//       totalAmount: this.calculateTotalAmount(),
//       orderDate: this.form.get('orderDate')?.value,
//       status: OrderStatus.Pending // Replace with the appropriate status
//     };

//     this.orderService.addOrder(order).subscribe(savedOrder => {
//       console.log('Order saved:', savedOrder);
//       // You can choose to do further actions after saving
//     });
//   }
// }
