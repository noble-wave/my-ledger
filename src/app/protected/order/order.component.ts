import { getOrderItemMeta, getOrderMeta } from '@app/models/order.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/services/app.service';
import { FormHelper, FormMeta, ModelMeta } from '@app/shared-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  customers: any[];
  products: any[];

  constructor(private orderService: OrderService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      productId: [''],
      customerId: [''], 
    });
    this.orderService.getAllCustomer().subscribe((customers) => {
      this.customers = customers;
    });
    this.orderService.getAllProduct().subscribe((products) => {
      this.products = products;
    });
  }

  handleProductSelection(selectedProduct: any) {
    console.log('Selected Product:', selectedProduct);
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

