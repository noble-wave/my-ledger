import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '@app/models/order.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private lastOrderNumber: number = 0;

  constructor(private storage: StorageService) {}

  addOrder(orderData: Order) {
    orderData.orderId = `oi_${cryptoRandomString({ length: 10 })}`;
    orderData.orderNumber = this.generateOrderNumber();
    return this.storage.addRecord<Order>(tableNames.orderData, orderData);
  }

  private generateOrderNumber(): string {
    this.lastOrderNumber++;
    return `on_${this.lastOrderNumber}`;
  }

  getAll() {
    return this.storage.getAll<Order>(tableNames.orderData);
  }

  getStatusOptions() {
    return this.toArray(OrderStatus);
  }

  toArray(enumme) {
    let obj = Object.keys(enumme).map((key) => {
      return { label: key, value: enumme[key] };
    });
    console.log(obj);
    return obj;
  }
}
