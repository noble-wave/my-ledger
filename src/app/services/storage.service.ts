import { Injectable } from '@angular/core';
import {
  DBConfig,
  Key,
  NgxIndexedDBService,
  ObjectStoreMeta,
} from 'ngx-indexed-db';
import { catchError, concatMap, switchMap } from 'rxjs';

export const tableNames = {
  misc: 'misc',
  product: 'product',
  customer: 'customer',
  inventory: 'inventory',
  sell: 'sell',
  sellPayment: 'sellPayment',
  sellSetting: 'sellSetting',
  quickSellSetting: 'quickSellSetting',
  sellItem: 'sellItem',
  wallet: 'wallet',
  walletHistory: 'walletHistory',
};

export const dbConfig: DBConfig = {
  name: 'etrivia-ledger',
  version: 3,
  objectStoresMeta: [
    {
      store: tableNames.misc,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'tag', keypath: 'tag', options: { unique: false } },
      ],
    },
    {
      store: tableNames.product,
      storeConfig: { keyPath: 'productId', autoIncrement: false },
      storeSchema: [
        {
          name: 'productName',
          keypath: 'productName',
          options: { unique: false },
        },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
    {
      store: tableNames.customer,
      storeConfig: { keyPath: 'customerId', autoIncrement: false },
      storeSchema: [
        {
          name: 'customerName',
          keypath: 'customerName',
          options: { unique: false },
        },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
    {
      store: tableNames.inventory,
      storeConfig: { keyPath: 'productId', autoIncrement: false },
      storeSchema: [],
    },
    {
      store: tableNames.sell,
      storeConfig: { keyPath: 'sellId', autoIncrement: false },
      storeSchema: [
        { name: 'sellDate', keypath: 'sellDate', options: { unique: false } },
      ],
    },
    {
      store: tableNames.sellPayment,
      storeConfig: { keyPath: 'paymentId', autoIncrement: false },
      storeSchema: [
        { name: 'sellId', keypath: 'sellId', options: { unique: false } },
        {
          name: 'customerId',
          keypath: 'customerId',
          options: { unique: false },
        },
      ],
    },
    {
      store: tableNames.sellItem,
      storeConfig: { keyPath: 'sellItemId', autoIncrement: false },
      storeSchema: [
        { name: 'sellId', keypath: 'sellId', options: { unique: false } },
        { name: 'productId', keypath: 'productId', options: { unique: false } },
      ],
    },
    {
      store: tableNames.wallet,
      storeConfig: { keyPath: 'walletId', autoIncrement: false },
      storeSchema: [
        {
          name: 'customerId',
          keypath: 'customerId',
          options: { unique: false },
        },
      ],
    },
    {
      store: tableNames.walletHistory,
      storeConfig: { keyPath: 'walletHistoryId', autoIncrement: false },
      storeSchema: [
        { name: 'walletId', keypath: 'walletId', options: { unique: false } },
        {
          name: 'customerId',
          keypath: 'customerId',
          options: { unique: false },
        },
      ],
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  local: Storage;
  session: Storage;

  constructor(private db: NgxIndexedDBService) {
    this.local = localStorage;
    this.session = sessionStorage;

    if (!('indexedDB' in window)) {
      console.info("This browser doesn't support IndexedDB");
      return;
    } else {
      console.info('This browser supports IndexedDB');
    }
  }

  deleteDatabase() {
    return this.db.deleteDatabase();
  }

  clear(tableName: string) {
    return this.db.clear(tableName);
  }

  deleteByIndex<T>(
    tableName: string,
    index: string,
    key: IDBKeyRange,
    keyColunm: string
  ) {
    return this.db.getAllByIndex<T>(tableName, index, key).pipe(
      concatMap((x) =>
        this.db.bulkDelete(
          tableName,
          x.map((y) => y[keyColunm])
        )
      )
    );
  }

  createObjectStore(storeSchema: ObjectStoreMeta) {
    return this.db.createObjectStore(storeSchema);
  }

  //   addStoreIfNotAlready(storeSchema: ObjectStoreMeta) {
  //     // return this.db.addStoreIfNotAlready(storeSchema);
  //     this.db.isStoreExist(storeSchema.store).subscribe(x => {
  //       if (!x) {
  //         this.db.createObjectStore(storeSchema);
  //       }
  //     })
  //   }

  addRecord<T>(tableName: string, obj: T) {
    return this.db.add<T>(tableName, obj);
  }

  deleteRecord(tableName: string, key: string | number) {
    return this.db.deleteByKey(tableName, key);
  }

  getByKey<T>(storeName: string, key: IDBValidKey) {
    return this.db.getByKey<T>(storeName, key);
  }

  bulkGet(tableName: string, obj: IDBValidKey[]) {
    return this.db.bulkGet(tableName, obj);
  }

  updateRecord<T>(tableName: string, obj: T) {
    return this.db.update(tableName, obj);
  }

  saveRecord<T>(tableName: string, obj: T) {
    return this.db.update(tableName, obj);
  }

  count(tableName: string, obj?: IDBValidKey | IDBKeyRange) {
    return this.db
      .count(tableName, obj)
      .pipe(catchError((err, caught) => caught));
  }

  countByIndex(
    tableName: string,
    indexName: string,
    obj?: IDBValidKey | IDBKeyRange
  ) {
    return this.db
      .countByIndex(tableName, indexName, obj)
      .pipe(catchError((err, caught) => caught));
  }

  getAll<T>(tableName: string) {
    return this.db.getAll<T>(tableName);
  }

  getByIndex<T>(tableName: string, indexName: string, key: IDBValidKey) {
    return this.db
      .getByIndex<T>(tableName, indexName, key)
      .pipe(catchError((err, caught) => caught));
  }

  getAllByIndex<T>(tableName: string, indexName: string, key: IDBKeyRange) {
    return this.db.getAllByIndex<T>(tableName, indexName, key);
  }

  bulkAdd(tableName: string, obj: Array<any>) {
    return this.db.bulkAdd(tableName, obj);
  }

  bulkPut(tableName: string, obj: Array<any>) {
    return this.db.bulkPut(tableName, obj);
  }

  bulkDelete(tableName: string, obj: Array<any>) {
    return this.db.bulkDelete(tableName, obj);
  }

  getLocal(key: string) {
    let value = this.local.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value === 'undefined' ? undefined : value;
      }
    } else {
      return undefined;
    }
  }

  getSession(key: string) {
    let value = this.local.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } else {
      return undefined;
    }
  }

  setLocal(key: string, value: any) {
    if (typeof value === 'string') {
      this.local.setItem(key, value);
    } else {
      this.local.setItem(key, JSON.stringify(value));
    }
  }

  setSession(key: string, value: any) {
    if (typeof value === 'string') {
      this.local.setItem(key, value);
    } else {
      this.local.setItem(key, JSON.parse(JSON.stringify(value)));
    }
  }
}
