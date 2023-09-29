import { Component, OnInit } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { ProductService } from '../services/product.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: [],
})
export class ProductListComponent implements OnInit {
  products$: any;
  tableSettings: LocalTableSettings;

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    let columns = [
      { name: 'productId', text: 'Product Id', sell: 1 },
      { name: 'productName', text: 'Product Name', sell: 2 },
      { name: 'description', text: 'Description', sell: 3 },
      { name: 'price', text: 'Price', sell: 4 },
      { name: 'count', text: 'Count', sell: 5 },
    ];
    let excludeColumns = ['productId'];
    let displayColumns = columns.filter(
      (x) => excludeColumns.indexOf(x.name) === -1
    );

    this.tableSettings = new LocalTableSettings({
      columns: columns,
      displayColumns: displayColumns,
      idColumnName: 'productId',
      canGoToEdit: true,
    });

    this.getData();
  
  }
 
  getData() {
    this.products$ = forkJoin([
      this.service.getAllInventory(),
      this.service.getAll(),
    ]).pipe(
      map((res: any[]) => {
        let pri = res[0];
        let pr = res[1];

        pr.forEach((x) => {
          x['count'] = pri.find((y) => y.productId == x.productId)?.count;
        });
        return pr;
      })
    );

  }
}
