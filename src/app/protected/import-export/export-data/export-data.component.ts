import { Component } from '@angular/core';
import { CustomerService } from '@app/protected/services/customer.service';
import { ProductService } from '@app/protected/services/product.service';
import { SellService } from '@app/protected/services/sell.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import { AppService } from '@app/services/app.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'],
})
export class ExportDataComponent {
  customers: any;
  products: any;
  sells: any;
  datePicker: FormGroup;
  panelOpenState = false;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private sellService: SellService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    // Initialize the date picker with a default date range
    let currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.datePicker = new FormGroup({
      start: new FormControl(currentDate),
      end: new FormControl(new Date()),
    });
  }

  // exportData is your array which you want to dowanload as csv and sample.csv is your file name, customize the below lines as per your need.
  async downloadProductData() {
    try {
      const products = await firstValueFrom(this.productService.getAll());
      const inventory = await firstValueFrom(
        this.productService.getAllInventory()
      );

      const csvProducts = Papa.unparse(products);
      const csvInventory = Papa.unparse(inventory);

      const productBlob = new Blob([csvProducts], { type: 'text/csv' });
      const productInventoryBlob = new Blob([csvInventory], { type: 'text/csv' });
      saveAs(productBlob, 'products.csv');
      saveAs(productInventoryBlob, 'productnInventorys.csv');

      this.app.noty.notifyClose('Products and Product Inventorys data exported successfully.');
    } catch (error) {
      console.error('Error while downloading product data:', error);
    }
  }

  async downloadCustomerData() {
    try {
      const x = await firstValueFrom(this.customerService.getAll());
      this.customers = x;
      const csv = Papa.unparse(this.customers);
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, 'customer.csv');
      this.app.noty.notifyClose('Customer data exported successfully as CSV.');
    } catch (error) {
      console.error('Error while downloading customer data:', error);
      // You can handle errors here
    }
  }

  async downloadSellData() {
    try {
      const x = await firstValueFrom(this.sellService.getAll());
      this.sells = x;
      const csv = Papa.unparse(this.sells);
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, 'sell.csv');

      this.app.noty.notifyClose('Sell data exported successfully.');
    } catch (error) {
      console.error('Error while downloading sell data:', error);
      // You can handle errors here
    }
  }

  exportProductAndInventoryDataByDate() {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    forkJoin({
      productData: this.productService.getProductByDate(startDate, endDate),
      inventoryData: this.productService.getProductInventoryByDate(
        startDate,
        endDate
      ),
    }).subscribe(({ productData, inventoryData }) => {
      const csvProducts = Papa.unparse(productData);
      const csvInventory = Papa.unparse(inventoryData);

      this.exportData(csvProducts, 'products.csv');
      this.exportData(csvInventory, 'productInventorys.csv');
      this.app.noty.notifyClose(
        'Product by Date data with Inventory exported successfully.'
      );
    });
  }

  // Export customer data based on date range
  exportCustomerDataByDate() {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    this.customerService
      .getCustomerByDate(startDate, endDate)
      .subscribe((x) => {
        const csv = Papa.unparse(x);
        this.exportData(csv, 'customer.csv');
        this.app.noty.notifyClose('Customer data exported successfully.');
      });
  }

  // Export sell data based on date range
  exportSellDataByDate() {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    this.sellService.getSellByDate(startDate, endDate).subscribe((x) => {
      const csv = Papa.unparse(x);
      this.exportData(csv, 'sell.csv');
      this.app.noty.notifyClose('Sell data exported successfully.');
    });
  }

  // Generic method to export data as a JSON file
  exportData(csv: any, fileName: string) {
    return saveAs(new Blob([csv], { type: 'text/csv' }), fileName);
  }
}





