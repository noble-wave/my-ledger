import { Component } from '@angular/core';
import { ProductService } from '@app/protected/services/product.service';
import { LocalTableSettings } from '@app/shared-services';
import { Location } from '@angular/common';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warn-inventory',
  templateUrl: './warn-inventory.component.html',
  styleUrls: ['./warn-inventory.component.scss'],
})
export class WarnInventoryComponent {
  products$: any;
  tableSettings: LocalTableSettings;
  productId: string;

  constructor(
    private service: ProductService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    let columns = [
      { name: 'productId', text: 'Product Id', sell: 1 },
      { name: 'productName', text: 'Product Name', sell: 2 },
      { name: 'count', text: 'Count', sell: 3 },
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
    this.products$ = this.service.getInventoryWarnThreshold();

    // this.products$ = this.service.getInventoryWarnThreshold().pipe(
    //   map((productInventorys) => {
    //     productInventorys.forEach((productInventory) => {
    //       productInventory['updatedAt'] = new Date(productInventory.updatedAt)
    //         ?.toISOString()
    //         .split('T')[0];
    //     });
    //     return productInventorys;
    //   })
    // );
  }

  navigateBack() {
    this.location.back();
  }

  settings() {
    this.router.navigate(['/setting'], {
      fragment: 'dashboardSetting',
    });
  }
}
