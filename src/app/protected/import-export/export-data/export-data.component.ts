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
      console.error('Error while downloading products data:', error);
    }
  }

  async downloadCustomerData() {
    try {
      const customers = await firstValueFrom(this.customerService.getAll());
      const csvCustomers = Papa.unparse(customers);
      const customersBlob = new Blob([csvCustomers], { type: 'text/csv' });
      saveAs(customersBlob, 'customers.csv');
      this.app.noty.notifyClose('Customers data exported successfully as CSV.');
    } catch (error) {
      console.error('Error while downloading customers data:', error);
      // You can handle errors here
    }
  }

  async downloadSellData() {
    try {
      const sells = await firstValueFrom(this.sellService.getAll());
      const sellItems = await firstValueFrom(this.sellService.getAllSellItem());
      const sellPayments = await firstValueFrom(this.sellService.getAllSellPayment());

      const csvSells = Papa.unparse(sells);
      const csvSellItems = Papa.unparse(sellItems);
      const csvSellPayments = Papa.unparse(sellPayments);

      const sellsBlob = new Blob([csvSells], { type: 'text/csv' });
      const sellItemsBlob = new Blob([csvSellItems], { type: 'text/csv' });
      const sellPaymentsBlob = new Blob([csvSellPayments], { type: 'text/csv' });

      saveAs(sellsBlob, 'sells.csv');
      saveAs(sellItemsBlob, 'sellItems.csv');
      saveAs(sellPaymentsBlob, 'sellPayments.csv');

      this.app.noty.notifyClose('Sells, Sell Itmes and Sell Payments data exported successfully.');
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
        'Products and product Inventorys by Date data exported successfully.'
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
        this.exportData(csv, 'customers.csv');
        this.app.noty.notifyClose('Customers data exported successfully.');
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

    forkJoin({
      sells: this.sellService.getSellByDate(startDate, endDate),
      sellItmes: this.sellService.getSellItemsByDate(startDate, endDate),
      sellPayments: this.sellService.getSellPaymentsByDate(startDate, endDate),
    }).subscribe(({ sells, sellItmes, sellPayments }) => {
      const csvsells = Papa.unparse(sells);
      const csvsellItmes = Papa.unparse(sellItmes);
      const csvsellPayments = Papa.unparse(sellPayments);

      this.exportData(csvsells, 'sells.csv');
      this.exportData(csvsellItmes, 'sellItmes.csv');
      this.exportData(csvsellPayments, 'sellPayments.csv');
      this.app.noty.notifyClose(
        'sells, Sell Itmes and Sell Payments by Date data exported successfully.'
      );
    });

    // this.sellService.getSellByDate(startDate, endDate).subscribe((x) => {
    //   const csv = Papa.unparse(x);
    //   this.exportData(csv, 'sells.csv');
    //   this.app.noty.notifyClose('Sells data exported successfully.');
    // });
  }

  // Generic method to export data as a JSON file
  exportData(csv: any, fileName: string) {
    return saveAs(new Blob([csv], { type: 'text/csv' }), fileName);
  }
}





