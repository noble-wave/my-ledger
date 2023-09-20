import { Injectable } from '@angular/core';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Customer } from '@app/models/customer.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private storage: StorageService) { }
  private apiUrl = 'your_api_url_here';

  
  get(id: string) {
    return this.storage.getByKey<Customer>(tableNames.customer, id);
  }

  getAll() {
    return this.storage.getAll<Customer>(tableNames.customer);
  }

  add(customer: Customer) {
    customer.createdAt = new Date();
    customer.customerId = `cs_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.customer, customer);
  }

  update(customer: Customer) {
    customer.updatedAt = new Date();
    return this.storage.updateRecord(tableNames.customer, customer);
  }

  uploadCustomerData(customerData: any[]) {
    return this.storage.bulkAdd(tableNames.customer, customerData);
  }
  
  getDataByDate(startDate: string, endDate: string) {
    return this.storage.getAll<any>(`${this.apiUrl}/products?startDate=${startDate}&endDate=${endDate}`);
  }

}
