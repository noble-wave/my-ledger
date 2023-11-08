import { Injectable } from '@angular/core';
import { Sell, SellStatus } from '@app/models/sell.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { forkJoin, map, switchMap } from 'rxjs';

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

  getAll() {
    return this.storage.getAll<Sell>(tableNames.sell);
  }

  get(sellId: string) {
    return this.storage.getByKey<Sell>(tableNames.sell, sellId);
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
    return this.storage.bulkAdd(tableNames.sell, sellData);
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
