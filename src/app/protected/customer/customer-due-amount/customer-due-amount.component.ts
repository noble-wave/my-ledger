import { Component } from '@angular/core';
import { CustomerService } from '@app/protected/services/customer.service';
import { SellService } from '@app/protected/services/sell.service';
import { LocalTableSettings } from '@app/shared-services';
import { Location } from '@angular/common';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-customer-due-amount',
  templateUrl: './customer-due-amount.component.html',
  styleUrls: ['./customer-due-amount.component.scss'],
})
export class CustomerDueAmountComponent {
  customers$: any;
  tableSettings: LocalTableSettings;

  constructor(
    private customerService: CustomerService,
    private sellService: SellService,
    private location: Location
  ) {}

  ngOnInit(): void {
    let columns = [
      { name: 'customerId', text: 'Customer Id', sell: 1 },
      { name: 'customerName', text: 'Customer Name', sell: 2 },
      { name: 'totalDueAmount', text: 'Total Due Amount', sell: 3 },
    ];
    let excludeColumns = ['customerId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      tableIdentifier: 'customer-table',
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'customerId',
      canGoToEdit: true,
    });

    this.getData();
  }

  getData() {
    this.customers$ = forkJoin([
      this.customerService.getAll(),
      this.sellService.getAll(),
    ]).pipe(
      map((res: any[]) => {
        let customers = res[0];
        let sells: any[] = res[1];

        customers.forEach((x) => {
          let dueAmount = sells
            .filter((y) => y.customerId == x.customerId)
            ?.reduce((a, b) => a + (Number(b.dueAmount) || 0), 0);
          x['totalDueAmount'] = dueAmount;
        });
        return customers.filter((x) => x['totalDueAmount'] > 0);
      })
    );
  }

  navigateBack() {
    this.location.back();
  }
}
