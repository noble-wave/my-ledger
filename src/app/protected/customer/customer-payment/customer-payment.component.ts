import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SellService } from '@app/protected/services/sell.service';
import { LocalTableSettings } from '@app/shared-services';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss'],
})
export class CustomerPaymentComponent {
  customerId: any;
  customerDetail: any;
  customerSells$: Observable<any[]>;
  tableSettings: LocalTableSettings;
  totalDueAmount: number | string = 0;
  tableHeading: string = 'Unsettled Sales Transactions';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private sellService: SellService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((x) => {
      this.customerId = x;
    });

    let columns = [
      { name: 'sellId', text: 'Sell Id', sell: 1 },
      { name: 'sellDisplayDate', text: 'Sell Date', sell: 2 },
      { name: 'netAmount', text: 'Net Amount', sell: 3 },
      { name: 'dueAmount', text: 'Due Amount', sell: 5 },
    ];
    let excludeColumns = ['sellId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      tableIdentifier: 'sells-table',
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'sellId',
      defaultPageSize: 5,
      // canGoToEdit: true,
    });

    this.getCustomerSellsData();
  }

  getCustomerSellsData() {
    this.route.params.subscribe((params) => {
      this.customerId = params['customerId'];
    });

    this.customerSells$ = forkJoin([this.sellService.getAll()]).pipe(
      map((res: any[]) => {
        let sells: any[] = res[0];

        // Filter sells based on the customer ID from route params
        let customerSells = sells.filter(
          (sell) => sell.customerId === this.customerId
        );

        customerSells.forEach((sell) => {
          sell['sellDisplayDate'] = new Date(sell.sellDate)
            ?.toISOString()
            .split('T')[0];
        });

        this.totalDueAmount = customerSells?.reduce(
          (a, b) => a + (Number(b.dueAmount) || 0),
          0
        );

        return customerSells.filter((x) => x.dueAmount !== 0);
      })
    );
  }

  navigateBack() {
    this.location.back();
  }

  addPayment() {
    this.router.navigate(['payment'], {
      queryParams: { custId: this.customerId },
    });
  }
}

// if (Array.isArray(sell.dueAmount)) {
//   sell['TotalDueAmount'] = sell.dueAmount.reduce((a, b) => a + (Number(b) || 0), 0);
// } else {
//   sell['TotalDueAmount'] = Number(sell.dueAmount) || 0;
// }
