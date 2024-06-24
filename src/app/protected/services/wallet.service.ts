import { Injectable } from '@angular/core';
import { Wallet, WalletHistory } from '@app/models/sell.model';
import { StorageService, tableNames } from '@app/services/storage.service';
import cryptoRandomString from 'crypto-random-string';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private storage: StorageService) {}

  addWallet(wallet: Wallet) {
    wallet.createdAt = new Date();
    wallet.updatedAt = wallet.createdAt;
    wallet.walletId = `wt_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.wallet, wallet);
  }

  updateWallet(value: Wallet) {
    value.updatedAt = new Date();
    return this.storage.updateRecord(tableNames.wallet, value);
  }

  getAllWallet() {
    return this.storage.getAll<Wallet>(tableNames.wallet);
  }

  getWalletByCustomerId(customerId: string) {
    return this.storage.getByIndex<Wallet>(
      tableNames.wallet,
      'customerId',
      customerId
    );
  }
  getWalletBywalletId(walletId: string) {
    return this.storage.getByKey<Wallet>(tableNames.wallet, walletId);
  }

  addWalletHistory(walletHistory: WalletHistory) {
    walletHistory.createdAt = new Date();
    walletHistory.walletHistoryId = `wth_${cryptoRandomString({ length: 10 })}`;
    return this.storage.addRecord(tableNames.walletHistory, walletHistory);
  }

  getAllWalletHistory() {
    return this.storage.getAll<WalletHistory>(tableNames.walletHistory);
  }

  getAllWalletHistoryByWalletId(walletId: string) {
    return this.storage.getAllByIndex<WalletHistory>(
      tableNames.walletHistory,
      'walletId',
      IDBKeyRange.only(walletId)
    );
  }
}
