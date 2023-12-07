import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { LocalTableSettings } from '@app/shared-services';
import { forkJoin, map } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-inventory',
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss'],
})
export class ProductInventoryComponent implements OnInit {
  products$: any;
  tableSettings: LocalTableSettings;
  selectedDate: Date = new Date();
  showDetails: boolean = false;

  constructor(private service: ProductService, private location: Location) {}

  ngOnInit(): void {
    let columns = [
      { name: 'productId', text: 'Product Id', sell: 1 },
      { name: 'productName', text: 'Product Name', sell: 2 },
      { name: 'updatedAt', text: 'Updated Date', sell: 3 },
      { name: 'count', text: 'Count', sell: 4 },
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
      canGoToEditCommands: ['../', 'product'],
    });

    this.getData();
  }

  getData() {
    this.products$ = forkJoin([
      this.service.getAll(),
      this.service.getAllInventory(),
    ]).pipe(
      map((res: any[]) => {
        let pri = res[0];
        let pr = res[1];

        pr.forEach((x) => {
          x['productName'] = pri.find(
            (y) => y.productId == x.productId
          )?.productName;
          x['updatedAt'] = new Date(x['updatedAt'])
            ?.toISOString()
            .split('T')[0];
        });
        pr.sort(
          (a, b) =>
            (new Date(b.updatedAt).getTime() === this.selectedDate.getTime()
              ? 1
              : new Date(b.updatedAt).getTime()) -
            new Date(a.updatedAt).getTime()
        );
        return pr;
      })
    );
  }

  navigateBack() {
    this.location.back();
  }

  toggleDetails(){
    this.showDetails = !this.showDetails
  }
}
