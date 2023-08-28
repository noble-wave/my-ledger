import { Component } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { OrderService } from '../services/order.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  orders$: any;
  tableSettings: LocalTableSettings;

  constructor(private service: OrderService) {}

  ngOnInit(): void {
    let columns = [
      { name: 'orderId', text: 'Order Id', order: 1 },
      { name: 'orderNumber', text: 'Order Number', order: 2 },
      { name: 'customerName', text: 'Customer Name', order: 3 },
      { name: 'status', text: 'Status', order: 4 },
      { name: 'qty', text: 'Quantity', order: 5 },
      { name: 'totalAmount', text: 'Total Amount', order: 5 },
      
    ];
    let excludeColumns = ['customerId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'orderId',
      canGoToEdit: false,
      canGoToView: true
    });

    this.orders$ = this.service.getAll().pipe(
      map((orders) => {
        orders.forEach(
          (order) =>
            (order['qty'] = order.items.reduce((qty, orderItem) => {
              qty += orderItem.quantity;
              return qty;
            }, 0))
        );
        return orders;
      })
    );
  }
}
