import { Component } from '@angular/core';
import { CustomerService } from '@app/protected/services/customer.service';
import { WalletService } from '@app/protected/services/wallet.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormMeta, LocalTableSettings, ModelMeta } from '@app/shared-services';
import { forkJoin, map } from 'rxjs';
import { AppService } from '@app/services/app.service';
import { FormGroup } from '@angular/forms';
import { Wallet, getWalletMeta } from '@app/models/sell.model';

@Component({
  selector: 'app-customer-wallet-payment',
  templateUrl: './customer-wallet-payment.component.html',
  styleUrls: ['./customer-wallet-payment.component.scss'],
})
export class CustomerWalletPaymentComponent {
  walletId: string;
  customerWalletHistory$: any;
  tableSettings: LocalTableSettings;
  totalWalletAmount: number;
  form: FormGroup;
  formMeta = new FormMeta();
  modelMeta: ModelMeta[];

  constructor(
    private walletService: WalletService,
    private location: Location,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.modelMeta = getWalletMeta();
    this.route.params.subscribe((params) => {
      this.walletId = params['walletId'];
      this.form = this.app.meta.toFormGroup({}, this.modelMeta);
    });

    let columns = [
      { name: 'walletId', text: 'Wallet Id', sell: 1 },
      { name: 'walletHistoryId', text: 'Wallet History Id', sell: 2 },
      { name: 'customerName', text: 'Customer Name', sell: 3 },
      { name: 'walletAmount', text: 'Wallet Amount', sell: 4 },
      { name: 'description', text: 'Description', sell: 5 },
      { name: 'date', text: 'Date', sell: 6 },
    ];
    let excludeColumns = ['walletHistoryId', 'walletId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      tableIdentifier: 'customer-walletHistory-table',
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'walletId',
      canGoToEdit: false,
    });
    this.getData();
  }

  getData() {
    this.customerWalletHistory$ = forkJoin([
      this.walletService.getAllWalletHistoryByWalletId(this.walletId),
      this.customerService.getAll(),
    ]).pipe(
      map((res: any[]) => {
        let walletHistory = res[0];
        let customers: any[] = res[1];

        walletHistory.forEach((x) => {
          x['customerName'] = customers.find(
            (y) => y.customerId == x.customerId
          )?.customerName;

          this.totalWalletAmount = walletHistory.reduce(
            (total, entry) => total + (Number(entry.walletAmount) || 0),
            0
          );

          x['date'] = new Date(x.createdAt).toISOString().split('T')[0];
        });
        return walletHistory;
      })
    );
  }

  navigateBack() {
    this.location.back();
  }

  savePayment() {
    let newData = this.form.value;
    let newWalletAmount = newData.walletAmount;
    let newWalletDescription = newData.description;

    this.walletService.getWalletBywalletId(this.walletId).subscribe((res) => {
      if (res && newWalletAmount && newWalletDescription) {
        let updateWallet = {
          walletId: res.walletId,
          customerId: res.customerId,
          walletAmount: res.walletAmount + newWalletAmount,
          createdAt: res.createdAt,
        };
        console.log('new wallet data' + updateWallet);
        // this.walletService
        //   .updateWallet(updateWallet)
        //   .subscribe((result) => {
        //     console.log(result);
        //     walletHistory = {
        //       customerId: customerId,
        //       walletId: result.walletId,
        //       walletAmount: extraAmount,
        //     };
        //     this.walletService
        //       .addWalletHistory(walletHistory)
        //       .subscribe((resultwalletHistory) => {
        //         console.log(resultwalletHistory);
        //       });
        //   });
      } else {
        this.app.noty.notifyLocalValidationError('');
      }
    });
  }
}
