import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { ProductService } from '../services/product.service';
import { forkJoin, map } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';
import { Router } from '@angular/router';
import { DummyDataLoaderComponent } from '../dummy-data-loader/dummy-data-loader.component';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products$: any;
  tableSettings: LocalTableSettings;
  showDetails: boolean = false;
  dataPresent: boolean = false;
  totalSaleAmount: number;
  totalPurchaseAmount: number;

  constructor(
    private service: ProductService,
    private location: Location,
    public dialog: MatDialog,
    private router: Router,
    private sellService: SellService
  ) {}

  ngOnInit(): void {
    // this.sellService.isDataPresent().subscribe((dataPresent) => {
    //   this.dataPresent = dataPresent;
    //   const isFirstVisit = localStorage.getItem('isFirstVisitProductList');
    //   if (!isFirstVisit || !dataPresent) {
    //     localStorage.setItem('isFirstVisitProductList', 'true');
    //     this.demoData('enterAnimationDuration', 'exitAnimationDuration');
    //   }
    // });

    let columns = [
      { name: 'productId', text: 'Product Id', sell: 1 },
      { name: 'productName', text: 'Product Name', sell: 2 },
      { name: 'description', text: 'Description', sell: 3 },
      { name: 'purchaseCost', text: 'Purchase Amount', sell: 4 },
      { name: 'price', text: 'Sale Amount', sell: 5 },
      { name: 'count', text: 'Count', sell: 6 },
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

        this.totalSaleAmount = pr?.reduce(
          (a, b) => a + (Number(b.price) * Number(b.count) || 0),
          0
        );

        this.totalPurchaseAmount = pr?.reduce(
          (a, b) => a + (Number(b.purchaseCost) * Number(b.count) || 0),
          0
        );

        pr.sort((a, b) => {
          return a.productName.localeCompare(b.productName, 'en', {
            sensitivity: 'base',
          });
        });

        return pr;
      })
    );
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  navigateBack() {
    this.location.back();
  }
}
