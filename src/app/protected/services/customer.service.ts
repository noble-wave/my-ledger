import { Injectable } from '@angular/core';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Customer } from '@app/models/customer.model';
import { map } from 'rxjs';


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
    customer.updatedAt = customer.createdAt;
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
  
  getCustomerByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Customer>(tableNames.customer).pipe(
      map((customers) =>
      customers.filter((customer) => {
          return customer.updatedAt >= startDate && customer.updatedAt <= endDate;
        })
      )
    );
  }

  deleteAllCustomer() {
    return this.storage.clear(tableNames.customer);
  }

  deleteCustomerByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage
      .deleteByIndex<Customer>(
        tableNames.customer,
        'updatedAt',
        IDBKeyRange.bound(startDate, endDate, false, true),
        'productId'
      );
  }

}
