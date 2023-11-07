import { Injectable } from '@angular/core';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Customer } from '@app/models/customer.model';
import { forkJoin, map, switchMap } from 'rxjs';


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
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
  
    return this.storage.getAll<Customer>(tableNames.customer).pipe(
      map((customers) =>
        customers.filter((customer) => {
          const customerDate = new Date(customer.updatedAt);
          return customerDate >= startDate && customerDate < nextDay;
        })
      )
    );
  }
  

  deleteAllCustomer() {
    return this.storage.clear(tableNames.customer);
  }

  deleteCustomerByDate1(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage
      .deleteByIndex<Customer>(
        tableNames.customer,
        'updatedAt',
        IDBKeyRange.bound(startDate, endDate, false, true),
        'customerId'
      );
  }

  deleteCustomerByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Customer>(tableNames.customer).pipe(
      switchMap((customers) => {
        const filteredCustomers = customers.filter((customer) => {
          const updatedAtDate = new Date(customer.updatedAt);
          return updatedAtDate >= startDate && updatedAtDate <= endDate;
        });
  
        const deleteOperations = filteredCustomers.map((customer) => {
          if (customer.customerId !== undefined) {
            return this.storage.deleteRecord(tableNames.customer, customer.customerId);
          }
          return null;
        });
  
        // Filter out any potential 'null' values from the previous step
        const validDeleteOperations = deleteOperations.filter((op) => op !== null);
  
        return forkJoin(validDeleteOperations);
      })
    );
  }
  

}
