import { Component } from '@angular/core';
import { ProductService } from '@app/protected/services/product.service';
import { LocalTableSettings } from '@app/shared-services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-info-inventory',
  templateUrl: './info-inventory.component.html',
  styleUrls: ['./info-inventory.component.scss']
})
export class InfoInventoryComponent {
  products$: any;
  tableSettings: LocalTableSettings;
  productId:string;

  constructor(private service: ProductService, private location: Location) { }

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

    navigateBack() {
      this.location.back();
    }

}
