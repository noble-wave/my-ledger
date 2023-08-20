import { getOrderItemMeta, getOrderMeta } from '@app/models/order.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/services/app.service';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs';
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
export class OrderComponent implements OnInit {
  form: FormGroup;
  customers: any[];
  products: any[];
  modelMeta: ModelMeta[];

  constructor(private orderService: OrderService, private customerService: CustomerService, private productService: ProductService, private fb: FormBuilder, private app: AppService) { }

  ngOnInit(): void {

    this.modelMeta = getOrderMeta();
    this.form = this.app.meta.toFormGroup({}, this.modelMeta);

    this.customerService.getAll().subscribe((customers) => {
      this.customers = customers;
    });

    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });
  }

  handleProductSelection(product: Product) {
    console.log('Selected Product:', product);
  }

  handleCustomerSelection(customer: Customer) {
    console.log('Selected customer:', customer);
    this.form.get('customerName')?.setValue(customer.customerName);
  }

  saveProduct() {
    const selectedCustomerId = this.form.get('customerId')?.value;
    const selectedProductId = this.form.get('productId')?.value;

    if (!selectedCustomerId || !selectedProductId) {
      return; // Prevent saving if customer or product is not selected
    }

    const order = {
      customerId: selectedCustomerId,
      productId: selectedProductId,
    };

    // this.orderService.addOrderData(order).subscribe(
    //   () => {
    //     console.log('Order saved successfully.');
    //     // Clear the form after saving if needed
    //     this.form.reset();
    //   },
    //   (error) => {
    //     console.error('Error saving order:', error);
    //   }
    // );
  }
}

