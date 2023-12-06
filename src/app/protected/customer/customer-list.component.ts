import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { LocalTableSettings } from '@app/shared-services';
import { Location } from '@angular/common';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: []
})
export class CustomerListComponent {
  customers$: any;
  tableSettings: LocalTableSettings;
  showDetails: boolean = false;

  constructor(private service: CustomerService, private location: Location) { }

  ngOnInit(): void {
    let columns = [
      { name: 'customerId', text: 'Customer Id', sell: 1 },
      { name: 'customerName', text: 'Customer Name', sell: 2 },
      { name: 'phoneNumber', text: 'Phone Number', sell: 3 },
      { name: 'email', text: 'Email', sell: 4 },
      { name: 'addressLine1', text: 'Address Line1', sell: 5 },
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

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  navigateBack(){
    this.location.back();
  }
}
