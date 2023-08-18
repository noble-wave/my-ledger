import { Injectable } from '@angular/core';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Customer } from '@app/models/customer.model';
import { Product } from '@app/models/product.model';
import { of } from 'rxjs';
import { ProductInventory } from '@app/models/product-inventory.model';
import { OrderData } from '@app/models/order-data-model';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private storage: StorageService ) {}

  getAllProduct() {
    return this.storage.getAll<Product>(tableNames.product);
  }

  getAllInventory() {
    return this.storage.getAll<ProductInventory>(tableNames.inventory);
  }

  getAllCustomer() {
    return this.storage.getAll<Customer>(tableNames.customer);
  }

  addCustomer(customer: Customer) {
    customer.createdAt = new Date();
    customer.customerId = `cs_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.customer, customer);
  }

  addOrderData(orderData: OrderData) {
    return this.storage.addRecord<OrderData>(tableNames.orderData, orderData);
  }
  
  getAllOrderData() {
    return this.storage.getAll<OrderData>(tableNames.orderData);
  }
}
