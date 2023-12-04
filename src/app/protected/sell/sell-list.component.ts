import { Component } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { SellService } from '../services/sell.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-sell-list',
  templateUrl: './sell-list.component.html',
  styleUrls: ['./sell-list.component.scss'],
})
export class SellListComponent {
  sells$: any;
  tableSettings: LocalTableSettings;
  selectedDate: Date = new Date();

  constructor(private service: SellService) {}

  ngOnInit(): void {
    let columns = [
      { name: 'sellId', text: 'Sell Id', sell: 1 },
      // { name: 'sellNumber', text: 'Sell Number', sell: 2 },
      { name: 'sellDisplayDate', text: 'Sell Date', sell: 3 },
      { name: 'customerName', text: 'Customer Name', sell: 4 },
      { name: 'status', text: 'Status', sell: 5 },
      { name: 'totalQuantity', text: 'Total Quantity', sell: 6 },
      { name: 'netAmount', text: 'Net Amount', sell: 7 },
    ];
    let excludeColumns = ['customerId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'sellId',
      canGoToEdit: false,
      canGoToView: true,
    });

    this.sells$ = this.service.getAll().pipe(
      map((sells) => {
        sells.forEach((sell) => {
          sell['qty'] =
            sell.items?.reduce((qty, sellItem) => {
              qty += sellItem.quantity;
              return qty;
            }, 0) || 1;

          sell['sellDisplayDate'] = new Date(sell.sellDate)
            ?.toISOString()
            .split('T')[0];
        });
        sells.sort(
          (a, b) =>
            (new Date(b.sellDate).getTime() === this.selectedDate.getTime()
              ? 1
              : new Date(b.sellDate).getTime()) - new Date(a.sellDate).getTime()
        );
        return sells;
      })
    );
  }
}
