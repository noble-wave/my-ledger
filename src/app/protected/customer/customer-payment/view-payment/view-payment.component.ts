import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/protected/services/customer.service';
import { SellService } from '@app/protected/services/sell.service';
import { LocalTableSettings } from '@app/shared-services';
import { Observable, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
})
export class ViewPaymentComponent {
  customerId: any;
  customerSellPayments$: Observable<any[]>;
  tableSettings: LocalTableSettings;
  datePipe: any;
  tableHeading: string = 'Customer Payment History';
  selectedDate: Date = new Date();

  constructor(
  private location: Location,
  private route: ActivatedRoute,
  private customerService: CustomerService,
  private sellService: SellService
) {}

ngOnInit(): void {
  this.route.params.subscribe((x) => {
    this.customerId = x;
  });

  let columns = [
    { name: 'paymentId', text: 'Payment Id', sell: 1 },
    { name: 'sellId', text: 'Sell Id', sell: 2 },
    { name: 'paymentDate', text: 'Payment Date', sell: 3 },
    { name: 'amountPaid', text: 'Amount Paid', sell: 4 },
  ];
  let excludeColumns = ['paymentId','sellId'];
  let displayColumns = columns.filter(
    (x) => excludeColumns.indexOf(x.name) === -1
  );

  this.tableSettings = new LocalTableSettings({
    tableIdentifier: 'payments-table',
    columns: columns,
    displayColumns: displayColumns,
    idColumnName: 'paymentId',
    defaultPageSize: 5,
    // canGoToEdit: true,
  });

  this.getCustomerPaymentData();
}

getCustomerPaymentData() {
  this.route.params.subscribe((params) => {
    this.customerId = params['customerId'];
  });

  this.customerSellPayments$ = forkJoin([
    this.sellService.getAllSellPayment(),
  ]).pipe(
    map((res: any[]) => {
      let payments: any[] = res[0];

      // Filter sells based on the customer ID from route params
      let customerSellPayments = payments.filter((payment) => payment.customerId === this.customerId);

      customerSellPayments.forEach((payment) => {
        payment['paymentDate'] = new Date(payment.paymentDate)
          ?.toISOString()
          .split('T')[0];
        });
      
        customerSellPayments.sort(
          (a, b) =>
            (new Date(b.paymentDate).getTime() === this.selectedDate.getTime()
              ? 1
              : new Date(b.paymentDate).getTime()) - new Date(a.paymentDate).getTime()
        );

      return customerSellPayments;
    })
  );
}

}
