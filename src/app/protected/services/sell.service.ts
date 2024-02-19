import { Injectable } from '@angular/core';
import {
  Sell,
  SellItem,
  SellPayment,
  SellStatus,
} from '@app/models/sell.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SellService {
  constructor(private storage: StorageService) {}
  private apiUrl = 'your_api_url_here';

  
  isDataPresent(): Observable<boolean> {
    return this.storage
      .getAll<Sell>(tableNames.sell)
      .pipe(map((sells) => sells.length > 0));
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

  addSell(sellData: Sell) {
    sellData.sellId = `oi_${cryptoRandomString({ length: 10 })}`;
    sellData.sellNumber = `${cryptoRandomString({ length: 6 })}`;
    return this.storage.addRecord<Sell>(tableNames.sell, sellData);
  }

  updateSell(sellData: Sell) {
    return this.storage.updateRecord(tableNames.sell, sellData);
  }

  addSellPayment1(sellPayment: SellPayment) {
    sellPayment.paymentId = `pi_${cryptoRandomString({ length: 15 })}`;
    return this.storage.addRecord<SellPayment>(
      tableNames.sellPayment,
      sellPayment
    );
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

  getAll() {
    return this.storage.getAll<Sell>(tableNames.sell);
  }

  getAllSellPayment() {
    return this.storage.getAll<SellPayment>(tableNames.sellPayment);
  }

  getAllSellItem() {
    return this.storage.getAll<SellItem>(tableNames.sellItem);
  }

  get(sellId: string) {
    return this.storage.getByKey<Sell>(tableNames.sell, sellId);
  }

  getSellPaymentById(paymentId: string) {
    return this.storage.getByKey<Sell>(tableNames.sellPayment, paymentId);
  }

  getAllSellItemById(sellItemId: string) {
    return this.storage.getByKey<Sell>(tableNames.sellItem, sellItemId);
  }

  deleteAllSell() {
    return this.storage.clear(tableNames.sell);
  }

  deleteAllSellPayment() {
    return this.storage.clear(tableNames.sellPayment);
  }

  deleteAllSellItems() {
    return this.storage.clear(tableNames.sellItem);
  }

  uploadSellData(sellData: any[]) {
    return this.storage.bulkPut(tableNames.sell, sellData);
  }

  uploadSellPaymentsData(sellPaymentData: any[]) {
    return this.storage.bulkPut(tableNames.sellPayment, sellPaymentData);
  }

  uploadSellItemsData(sellItemsData: any[]) {
    return this.storage.bulkPut(tableNames.sellItem, sellItemsData);
  }

  getSellByDate(startDate: Date, endDate: Date) {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      map((sells) =>
        sells.filter((sell) => {
          const sellDate = new Date(sell.sellDate);
          return sellDate >= startDate && sellDate <= nextDay;
        })
      )
    );
  }

  getSellItemsByDate(startDate: Date, endDate: Date) {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
  
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      switchMap((sells) =>
        this.storage.getAll<SellPayment>(tableNames.sellItem).pipe(
          map((sellItems) =>
          sellItems.filter((sellItem) =>
              sells.some((sell) => {
                const sellDate = new Date(sell.sellDate);
                return sell.sellId === sellItem.sellId &&
                  sellDate >= startDate && sellDate <= nextDay;
              })
            )
          )
        )
      )
    );
  }

  getSellPaymentsByDate(startDate: Date, endDate: Date) {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
  
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      switchMap((sells) =>
        this.storage.getAll<SellPayment>(tableNames.sellPayment).pipe(
          map((sellPayments) =>
            sellPayments.filter((sellPayment) =>
              sells.some((sell) => {
                const sellDate = new Date(sell.sellDate);
                return sell.sellId === sellPayment.sellId &&
                  sellDate >= startDate && sellDate <= nextDay;
              })
            )
          )
        )
      )
    );
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

        const validDeleteOperations = deleteOperations.filter(
          (op) => op !== null
        );

        return forkJoin(validDeleteOperations);
      })
    );
  }

  deleteSellPaymentByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<SellPayment>(tableNames.sellPayment).pipe(
      switchMap((sellPayments) => {
        const filteredSells = sellPayments.filter((sellPayment) => {
          const paymentDate = new Date(sellPayment.paymentDate);
          return paymentDate >= startDate && paymentDate <= endDate;
        });

        const deleteOperations = filteredSells.map((sellPayment) => {
          if (sellPayment.paymentId !== undefined) {
            return this.storage.deleteRecord(tableNames.sellPayment, sellPayment.paymentId);
          }
          return null;
        });

        const validDeleteOperations = deleteOperations.filter(
          (op) => op !== null
        );

        return forkJoin(validDeleteOperations);
      })
    );
  }

  deleteSellPaymentByDate1(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<Sell>(tableNames.sell).pipe(
      switchMap((sells) => {
        return this.storage.getAll<SellPayment>(tableNames.sellPayment).pipe(
          map((sellPayments) => {
            const filteredSellPayments = sellPayments.filter((sellPayment) =>
              sells.some((sell) => {
                const sellDate = new Date(sell.sellDate);
                return sell.sellId === sellPayment.sellId &&
                  sellDate >= startDate && sellDate <= endDate;
              })
            );
            const deleteOperations = filteredSellPayments.map((sellPayment) => {
              if (sellPayment.sellId !== undefined) {
                return this.storage.deleteRecord(tableNames.sellPayment, sellPayment.sellId);
              }
              return null;
            });
  
            // Filter out any potential 'null' values from the previous step
            const validDeleteOperations = deleteOperations.filter(
              (op) => op !== null
            );
  
            return forkJoin(validDeleteOperations);
          })
        );
      })
    );
  }
  

  deleteSellItemsByDate(startDate: Date, endDate: Date) {
    endDate.setDate(endDate.getDate() + 1);
    return this.storage.getAll<SellItem>(tableNames.sellItem).pipe(
      switchMap((sellItems) => {
        const filteredSells = sellItems.filter((sellItem) => {
          const sellDate = new Date(sellItem.sellDate);
          return sellDate >= startDate && sellDate <= endDate;
        });

        const deleteOperations = filteredSells.map((sellItem) => {
          if (sellItem.sellItemId !== undefined) {
            return this.storage.deleteRecord(tableNames.sellItem, sellItem.sellItemId);
          }
          return null;
        });

        const validDeleteOperations = deleteOperations.filter(
          (op) => op !== null
        );

        return forkJoin(validDeleteOperations);
      })
    );
  }
}
