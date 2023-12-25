import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalTableSettings } from '@app/shared-services';
import { ProductService } from '../services/product.service';
import { forkJoin, map } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products$: any;
  tableSettings: LocalTableSettings;
  showDetails: boolean = false;
  // @ViewChild(DummyDataLoaderComponent) dummyDataLoader?: DummyDataLoaderComponent;

  constructor(
    private service: ProductService,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const isFirstVisit = localStorage.getItem('isFirstVisitProductList');

    if (!isFirstVisit) {
      localStorage.setItem('isFirstVisitProductList', 'true');

      this.demoData('enterAnimationDuration', 'exitAnimationDuration');
    }

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

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  navigateBack() {
    this.location.back();
  }

  async demoData(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogConfig = {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Welcome to Ledger App',
        dialogContent: `
      This application simplifies invoice generation, enables insightful sales analysis,
      and facilitates efficient product and customer management.<br><br>
      Would you like to explore the app with pre-populated data for a comprehensive understanding, or start with a clean slate?
    `,
        cancelButtonText: 'Start Fresh',
        confirmButtonText: 'Explore with Sample Data',
        color: 'primary',
      },
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true' ) {
        // this.dummyDataLoader.dataUploaded.subscribe(() => {
        //   // Handle data upload completion, e.g., refresh the data
        //   this.getData();
        // });

        // this.dummyDataLoader.uploadFiles();
      }
    });
  }
}
