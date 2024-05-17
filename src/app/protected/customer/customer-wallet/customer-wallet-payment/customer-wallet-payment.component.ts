import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '@app/protected/services/customer.service';
import { WalletService } from '@app/protected/services/wallet.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormMeta, LocalTableSettings, ModelMeta } from '@app/shared-services';
import { Subject, forkJoin, map, take } from 'rxjs';
import { AppService } from '@app/services/app.service';
import { FormGroup } from '@angular/forms';
import {
  Wallet,
  getWalletHistoryMeta,
  getWalletMeta,
} from '@app/models/sell.model';

@Component({
  selector: 'app-customer-wallet-payment',
  templateUrl: './customer-wallet-payment.component.html',
  styleUrls: ['./customer-wallet-payment.component.scss'],
})
export class CustomerWalletPaymentComponent {
  walletId: string;
  customerWalletHistory$ = new Subject();
  tableSettings: LocalTableSettings;
  totalWalletAmount: number;
  form: FormGroup;
  formMeta = new FormMeta();
  modelMeta: ModelMeta[];
  refreshing: boolean;
  selectedDate: Date = new Date();

  constructor(
    private walletService: WalletService,
    private location: Location,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private app: AppService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.modelMeta = getWalletHistoryMeta();
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
    let ob = forkJoin([
      this.walletService.getAllWalletHistoryByWalletId(this.walletId),
      this.customerService.getAll(),
      this.walletService.getWalletBywalletId(this.walletId),
    ]).pipe(
      map((res: any[]) => {
        let walletHistory = res[0];
        let customers: any[] = res[1];
        let wallet = res[2];

        walletHistory.forEach((x) => {
          x['customerName'] = customers.find(
            (y) => y.customerId == x.customerId
          )?.customerName;

          x['date'] = new Date(x.createdAt).toLocaleString();
        });
        walletHistory.sort(
          (a, b) =>
            (new Date(b.createdAt).getTime() === this.selectedDate.getTime()
              ? 1
              : new Date(b.createdAt).getTime()) -
            new Date(a.createdAt).getTime()
        );
        this.totalWalletAmount = wallet.walletAmount;
        return walletHistory;
      })
    );

    ob.pipe(take(1)).subscribe((data) => {
      this.customerWalletHistory$.next(data);
    });
  }

  navigateBack() {
    this.location.back();
  }

  savePayment() {
    let newData = this.form.value;
    let newWalletAmount = Number(newData.walletAmount);
    let newWalletDescription = newData.description;
    if (newWalletAmount < 0 && !newWalletDescription) {
      this.app.noty.notifyClose('Please fill the required field');
      return;
    }
    this.walletService.getWalletBywalletId(this.walletId).subscribe((res) => {
      if (res && newWalletAmount) {
        let updateWallet = {
          walletId: res.walletId,
          customerId: res.customerId,
          walletAmount: res.walletAmount + newWalletAmount,
          createdAt: res.createdAt,
        };
        this.walletService.updateWallet(updateWallet).subscribe((result) => {
          let walletHistory;
          walletHistory = {
            customerId: res.customerId,
            walletId: result.walletId,
            walletAmount: newWalletAmount,
            description: newWalletDescription,
          };
          this.walletService.addWalletHistory(walletHistory).subscribe(() => {
            this.app.noty.notifyClose('Wallet amount has been updated.');
            this.getData();
          });
        });
      } else {
        this.app.noty.notifyLocalValidationError('');
      }
      this.refreshing = true;
      this.cdr.detectChanges();
      this.form.reset();
      this.refreshing = false;
    });
  }
}
