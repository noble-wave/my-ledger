import { Injectable } from '@angular/core';
import { Sell, SellItem, SellPayment, SellStatus } from '@app/models/sell.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SellService {
    constructor(private storage: StorageService) {}
  private apiUrl = 'your_api_url_here';


  addSell(sellData: Sell) {
    sellData.sellId = `oi_${cryptoRandomString({ length: 10 })}`;
    sellData.sellNumber = `${cryptoRandomString({ length: 6 })}`;
    return this.storage.addRecord<Sell>(tableNames.sell, sellData);
  }

  updateSell(sellData: Sell) {
    // sell.updatedAt = new Date();
    return this.storage.updateRecord(tableNames.sell, sellData);
  }

  addSellPayment1(sellPayment: SellPayment) {
    sellPayment.paymentId = `pi_${cryptoRandomString({ length: 15 })}`;
    return this.storage.addRecord<SellPayment>(tableNames.sellPayment, sellPayment);
  }

  addSellItem(sellItem: SellItem) {
    sellItem.sellItemId = `si_${cryptoRandomString({ length: 15 })}`;
    return this.storage.addRecord<SellItem>(tableNames.sellItem, sellItem);
  }

  addSellItems(sellItems: SellItem[]) {
    sellItems.forEach((sellItem) => {
      sellItem.sellItemId = `si_${cryptoRandomString({ length: 15 })}`;
    });
    return this.storage.bulkAdd(tableNames.sellItem, sellItems);
  }
  
  //decrypted Function
  // addSellPayment(sellPayment: SellPayment,sellId: string, customerId: string, paymentDate: Date) {
  //   sellPayment.paymentId = `oi_${cryptoRandomString({ length: 15 })}`;
  //   sellPayment.sellId = sellId;
  //   sellPayment.customerId = customerId;
  //   sellPayment.paymentDate = paymentDate; 
  //   return this.storage.addRecord<SellPayment>(tableNames.sellPayment, sellPayment);
  // }
//   addSellItems(sellItems: SellItem[]) {
//     const sellItemsWithId = sellItems.map(item => ({
//         ...item,
//         sellItemId: `si_${cryptoRandomString({ length: 15 })}`
//     }));
//     return this.storage.bulkAdd(tableNames.sellItem, sellItemsWithId);
// }


  getAll() {
    return this.storage.getAll<Sell>(tableNames.sell);
  }

  getAllSellPayment() {
    return this.storage.getAll<SellPayment>(tableNames.sellPayment);
  }

  getAllSellItem() {
    return this.storage.getAll<SellItem>(tableNames.sellItem);
  }

  isDataPresent(): Observable<boolean> {
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      map((sells) => sells.length > 0)
    );
  }

  get(sellId: string) {
    return this.storage.getByKey<Sell>(tableNames.sell, sellId);
  }

  getSellPaymentById(paymentId: string) {
    return this.storage.getByKey<Sell>(tableNames.sellPayment, paymentId);
  }

  getAllSellItemId(sellItemId: string) {
    return this.storage.getByKey<Sell>(tableNames.sellItem, sellItemId);
  }

  getStatusOptions() {
    return this.toArray(SellStatus);
  }

  private toArray(enumme) {
    let obj = Object.keys(enumme).map((key) => {
      return { label: key, value: enumme[key] };
    });
    return obj;
  }

  uploadSellData(sellData: any[]) {
    return this.storage.bulkPut(tableNames.sell, sellData);
  }

  getDataByDate(startDate: string, endDate: string) {
    return this.storage.getAll<any>(`${this.apiUrl}/products?startDate=${startDate}&endDate=${endDate}`);
  }

  getSellByDate(startDate: Date, endDate: Date) {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
  
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      map((sells) =>
        sells.filter((sell) => {
          const sellDate = new Date(sell.sellDate);
          return sellDate >= startDate && sellDate < nextDay;
        })
      )
    );
  }
  

  deleteAllSell() {
    return this.storage.clear(tableNames.sell);
  }

  // deleteSellByDate(startDate: Date, endDate: Date) {
  //   endDate.setDate(endDate.getDate() + 1);
  //   return this.storage
  //     .deleteByIndex<Sell>(
  //       tableNames.sell,
  //       'sellDate',
  //       IDBKeyRange.bound(startDate, endDate, false, true),
  //       'sellDate'
  //     );
  // }

  deleteSellByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      switchMap((sells) => {
        const filteredSells = sells.filter((sell) => {
          const sellDate = new Date(sell.sellDate);
          return sellDate >= startDate && sellDate <= endDate;
        });
  
        const deleteOperations = filteredSells.map((sell) => {
          if (sell.sellId !== undefined) {
            return this.storage.deleteRecord(tableNames.sell, sell.sellId);
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
