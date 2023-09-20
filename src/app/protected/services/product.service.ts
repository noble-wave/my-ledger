import { Injectable } from '@angular/core';
import { Product } from '@app/models/product.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import { of } from 'rxjs';
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

  updateProductInventory(orderItems: any[]) {
    for (const orderItem of orderItems) {
      // Get the product ID and quantity from the order item
      const productId = orderItem.productId;
      const quantity = orderItem.quantity;

      // Use the getProductInventory method to get the current product inventory
      this.getProductInventory(productId).subscribe((productInventory) => {
        // Check if productInventory exists
        if (productInventory) {
          // Subtract the order item's quantity from the product inventory count
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

  getDataByDate(startDate: string, endDate: string) {
    return this.storage.getAll<any>(`${this.apiUrl}/products?startDate=${startDate}&endDate=${endDate}`);
  }
}
