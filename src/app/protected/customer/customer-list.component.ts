import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { LocalTableSettings } from '@app/shared-services';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: []
})
export class CustomerListComponent {
  customers$: any;
  tableSettings: LocalTableSettings;

  constructor(private service: CustomerService) { }

  ngOnInit(): void {
    let columns = [
      { name: 'customerId', text: 'Customer Id', order: 1 },
      { name: 'customerName', text: 'Customer Name', order: 2 },
      { name: 'phoneNumber', text: 'Phone Number', order: 3 },
      { name: 'email', text: 'Email', order: 4 },
      { name: 'addressLine1', text: 'Address Line1', order: 5 },
    ];
    let excludeColumns = ['customerId'];
    let displayColumns = columns.filter(x => excludeColumns.indexOf(x.name) === -1);

    this.tableSettings = new LocalTableSettings({
      tableIdentifier: 'customer-table',
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'customerId',
      canGoToEdit: true
    });

    this.customers$ = this.service.getAll();
  }
}
