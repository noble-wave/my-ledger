import { Injectable } from '@angular/core';
import { Product, ProductWithInventory } from '@app/models/product.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import {
  Observable,
  concatMap,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
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

  getInventoryWarnThreshold1(): Observable<ProductWithInventory[]> {
    return this.storage.getAll<ProductInventory>(tableNames.inventory).pipe(
      map((productInventorys) => {
        let warnInventoryThreshold = productInventorys.filter(
          (productInventory) => {
            return productInventory.count <= 10;
          }
        );
        return warnInventoryThreshold;
      }),
      concatMap((inventory) => {
        // return this.storage.getAllByIndex(tableNames.product, 'productId', IDBKeyRange.on inventory.map(x => x.productId));
        let productIds = inventory.map((x) => x.productId);
        return this.storage.getAll<Product>(tableNames.product).pipe(
          map((x) => {
            x.filter((y) => productIds.includes(y.productId as string));
            x.map(
              (z) =>
                (z['count'] = inventory.find((y) => y.productId == z.productId))
            );
            return x as any;
          }),
        );
      })
    );
  }

  getInventoryWarnThreshold(): Observable<ProductWithInventory[]> {
    return this.storage.getAll<ProductInventory>(tableNames.inventory).pipe(
      map((productInventorys) => {
        const warnInventoryThreshold = productInventorys.filter(
          (productInventory) => productInventory.count <= 10
        );
        return warnInventoryThreshold;
      }),
      concatMap((inventory) => {
        const productIds = inventory.map((x) => x.productId);
        return this.getAll().pipe(
          map((products) => {
            const productsWithInventory: ProductWithInventory[] = products
              .filter((product) => productIds.includes(product.productId as string))
              .map((product) => {
                const inventoryItem = inventory.find((item) => item.productId === product.productId);
                if (inventoryItem) {
                  return {
                    productId: product.productId,
                    productName: product.productName,
                    count: inventoryItem.count,
                  };
                }
                return null;
              })
              .filter((product) => product !== null) as ProductWithInventory[];
  
            return productsWithInventory;
          })
        );
      })
    );
  }
  
  getInventoryInfoThreshold(): Observable<ProductWithInventory[]> {
    return this.storage.getAll<ProductInventory>(tableNames.inventory).pipe(
      map((productInventorys) => {
        const warnInventoryThreshold = productInventorys.filter(
          (productInventory) => productInventory.count >= 10 && productInventory.count <= 25
        );
        return warnInventoryThreshold;
      }),
      concatMap((inventory) => {
        const productIds = inventory.map((x) => x.productId);
        return this.getAll().pipe(
          map((products) => {
            const productsWithInventory: ProductWithInventory[] = products
              .filter((product) => productIds.includes(product.productId as string))
              .map((product) => {
                const inventoryItem = inventory.find((item) => item.productId === product.productId);
                if (inventoryItem) {
                  return {
                    productId: product.productId,
                    productName: product.productName,
                    count: inventoryItem.count,
                  };
                }
                return null;
              })
              .filter((product) => product !== null) as ProductWithInventory[];
  
            return productsWithInventory;
          })
        );
      })
    );
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
  uploadProductInventoryData(productData: any[]) {
    return this.storage.bulkAdd(tableNames.inventory, productData);
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

  // getProductInventoryByDate(startDate: Date, endDate: Date) {
  //   endDate.setDate(endDate.getDate() + 1);
  //   return this.storage.getAll<ProductInventory>(tableNames.inventory).pipe(
  //     map((inventoryItems) =>
  //       inventoryItems.filter((inventoryItem) => {
  //         return inventoryItem.updatedAt >= startDate && inventoryItem.updatedAt <= endDate;
  //       })
  //     )
  //   );
  // }
  

  getProductInventoryByDate(startDate: Date, endDate: Date) {
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

  deleteAllProductInventory() {
    return this.storage.clear(tableNames.inventory);
  }

  deleteProductByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.deleteByIndex<Product>(
      tableNames.product,
      'updatedAt',
      IDBKeyRange.bound(startDate, endDate, false, true),
      'productId'
    );
  }
  
  deleteProductInventoryByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.deleteByIndex<ProductInventory>(
      tableNames.inventory,
      'updatedAt',
      IDBKeyRange.bound(startDate, endDate, false, true),
      'productId'
    );
  }

}
