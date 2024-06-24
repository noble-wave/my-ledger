import { Component } from '@angular/core';
import { WalletService } from '@app/protected/services/wallet.service';
import { LocalTableSettings } from '@app/shared-services';
import { Location } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { CustomerService } from '@app/protected/services/customer.service';

@Component({
  selector: 'app-customer-wallet',
  templateUrl: './customer-wallet.component.html',
  styleUrls: ['./customer-wallet.component.scss'],
})
export class CustomerWalletComponent {
  customerWallets$: any;
  tableSettings: LocalTableSettings;

  constructor(
    private walletService: WalletService,
    private location: Location,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    let columns = [
      { name: 'walletId', text: 'Wallet Id', sell: 1 },
      { name: 'customerName', text: 'Customer Name', sell: 2 },
      { name: 'walletAmount', text: 'Wallet Amount', sell: 3 },
    ];
    let excludeColumns = ['walletId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      tableIdentifier: 'customer-table',
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'walletId',
      canGoToEdit: true,
    });
    this.getData();
  }

  getData() {
    this.customerWallets$ = forkJoin([
      this.walletService.getAllWallet(),
      this.customerService.getAll(),
    ]).pipe(
      map((res: any[]) => {
        let wallets = res[0];
        let customers: any[] = res[1];

        wallets.forEach((x) => {
          x['customerName'] = customers.find(
            (y) => y.customerId == x.customerId
          )?.customerName;
        });
        return wallets;
      })
    );
  }

  navigateBack() {
    this.location.back();
  }
}
