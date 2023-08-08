import { Injectable } from '@angular/core';
import { Product } from '@app/models/product.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import { of } from 'rxjs';
import cryptoRandomString from 'crypto-random-string';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private storage: StorageService) { }

  get(id: string) {
    return this.storage.getByKey<Product>(tableNames.product, id);
  }

  getAll() {
    return this.storage.getAll<Product>(tableNames.product);
  }


  add(product: Product) {
    product.createdAt = new Date();
    product.productId = `pr_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.product, product);
  }

  update(value: Product) {
    value.updatedAt = new Date();
    return this.storage.addRecord(tableNames.product, value);
  }

}
