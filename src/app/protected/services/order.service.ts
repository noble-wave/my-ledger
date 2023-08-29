import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '@app/models/order.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private storage: StorageService) {}

  addOrder(orderData: Order) {
    orderData.orderId = `oi_${cryptoRandomString({ length: 10 })}`;
    orderData.orderNumber = `${cryptoRandomString({ length: 6 })}`;
    return this.storage.addRecord<Order>(tableNames.order, orderData);
  }

  getAll() {
    return this.storage.getAll<Order>(tableNames.order);
  }

  get(orderId: string) {
    return this.storage.getByKey<Order>(tableNames.order, orderId);
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
