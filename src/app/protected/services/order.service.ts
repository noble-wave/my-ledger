import { Injectable } from '@angular/core';
import { Order, OrderStatus } from '@app/models/order.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private storage: StorageService) {}
  private apiUrl = 'your_api_url_here';


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

  private toArray(enumme) {
    let obj = Object.keys(enumme).map((key) => {
      return { label: key, value: enumme[key] };
    });
    return obj;
  }

  uploadOrderData(orderData: any[]) {
    return this.storage.bulkAdd(tableNames.order, orderData);
  }

  getDataByDate(startDate: string, endDate: string) {
    return this.storage.getAll<any>(`${this.apiUrl}/products?startDate=${startDate}&endDate=${endDate}`);
  }

  getOrderByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Order>(tableNames.order).pipe(
      map((orders) =>
      orders.filter((order) => {
          return order.orderDate >= startDate && order.orderDate <= endDate;
        })
      )
    );
  }

}
