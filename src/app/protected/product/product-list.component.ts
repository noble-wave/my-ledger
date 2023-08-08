import { Component, OnInit } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: [

  ]
})
export class ProductListComponent implements OnInit {
  products$: any;
  tableSettings: LocalTableSettings;

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    let columns = [
      { name: 'productId', text: 'Product Id', order: 1 },
      { name: 'productName', text: 'Product Name', order: 2 },
      { name: 'description', text: 'Description', order: 3 },
    ];
    let excludeColumns = ['productId'];
    let displayColumns = columns.filter(x => excludeColumns.indexOf(x.name) === -1);

    this.tableSettings = new LocalTableSettings({
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'productId',
      canGoToEdit: true
    });

    this.products$ = this.service.getAll();
  }

}
