import { Injectable } from '@angular/core';
import { Product } from '@app/models/product.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import { map, of, switchMap } from 'rxjs';
import cryptoRandomString from 'crypto-random-string';
import { ProductInventory } from '@app/models/product-inventory.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private storage: StorageService) {}
  private apiUrl = 'your_api_url_here';

  get(productId: string) {
    return this.storage.getByKey<Product>(tableNames.product, productId);
  }

  getAll() {
    return this.storage.getAll<Product>(tableNames.product);
  }

  add(product: Product) {
    product.createdAt = new Date();
    product.updatedAt = product.createdAt;
    product.productId = `pr_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.product, product);
  }

  update(value: Product) {
    value.updatedAt = new Date();
    return this.storage.updateRecord(tableNames.product, value);
  }

  getProductInventory(productId: string) {
    return this.storage.getByKey<ProductInventory>(
      tableNames.inventory,
      productId
    );
  }

  saveInventory(productInventory: ProductInventory) {
    productInventory.updatedAt = new Date();
    return this.storage.saveRecord<ProductInventory>(
      tableNames.inventory,
      productInventory
    );
  }

  getAllInventory() {
    return this.storage.getAll<ProductInventory>(tableNames.inventory);
  }

  updateProductInventory(sellItems: any[]) {
    for (const sellItem of sellItems) {
      // Get the product ID and quantity from the sell item
      const productId = sellItem.productId;
      const quantity = sellItem.quantity;

      // Use the getProductInventory method to get the current product inventory
      this.getProductInventory(productId).subscribe((productInventory) => {
        // Check if productInventory exists
        if (productInventory) {
          // Subtract the sell item's quantity from the product inventory count
          productInventory.count -= quantity;

          // Save the updated product inventory using the saveInventory method
          this.saveInventory(productInventory).subscribe(() => {
            console.log(`Product inventory updated for product: ${productId}`);
          });
        }
      });
    }
  }

  uploadProductData(productData: any[]) {
    return this.storage.bulkAdd(tableNames.product, productData);
  }

  getProductByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Product>(tableNames.product).pipe(
      map((products) =>
        products.filter((product) => {
          return product.updatedAt >= startDate && product.updatedAt <= endDate;
        })
      )
    );
  }

  deleteAllProduct() {
    return this.storage.clear(tableNames.product);
  }

  deleteProductByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage
      .deleteByIndex<Product>(
        tableNames.product,
        'updatedAt',
        IDBKeyRange.bound(startDate, endDate, false, true),
        'productId'
      );
  }
}
