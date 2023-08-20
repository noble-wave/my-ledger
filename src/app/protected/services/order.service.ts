import { Injectable } from '@angular/core';
import { Order } from '@app/models/order.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private storage: StorageService) { }

  addOrder(orderData: Order) {
    return this.storage.addRecord<Order>(tableNames.orderData, orderData);
  }

  getAll() {
    return this.storage.getAll<Order>(tableNames.orderData);
  }
}
