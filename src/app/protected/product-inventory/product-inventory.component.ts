import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { LocalTableSettings } from '@app/shared-services';

@Component({
  selector: 'app-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss']
})
export class ProductInventoryComponent implements OnInit{
  products$: any;
  tableSettings: LocalTableSettings;
  productId:string;

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    let columns = [
      { name: 'productId', text: 'Product Id', sell: 1 },
      { name: 'productName', text: 'Product Name', sell: 2 },
      { name: 'count', text: 'Count', sell: 3 },
    ];
    let excludeColumns = ['productId'];
    let displayColumns = columns.filter(x => excludeColumns.indexOf(x.name) === -1);

    this.tableSettings = new LocalTableSettings({
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'productId',
      canGoToEdit: true
    });
 
    this.products$ = this.service.getInventoryInfoThreshold();

    }


}
