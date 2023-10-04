import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { SellService } from '../services/sell.service';
import { saveAs } from 'file-saver';
import { AppService } from '@app/services/app.service';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { tableNames } from '@app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss'],
})
export class ImportExportComponent {
  panelOpenState = false;

  selectedFiles: FileList | null = null;
  settings: any;
  customers: any;
  products: any;
  sells: any;
  downloadJsonHref: any;

  datePicker: FormGroup;

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private sellService: SellService,
    private app: AppService,
    public dialog: MatDialog
  ) {
    // this.generateDownloadJsonUri();
  }

  ngOnInit(): void {
    let currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.datePicker = new FormGroup({
      start: new FormControl(currentDate),
      end: new FormControl(new Date()),
    });
  }

  // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
  async downloadProductData() {
    try {
      const x = await firstValueFrom(this.productService.getAll());
      this.products = x;
      let exportData = this.products;
      saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'product.json'
      );
    } catch (error) {
      console.error('Error while downloading product data:', error);
      // You can handle errors here
    }
  }

  async downloadCustomerData() {
    try {
      const x = await firstValueFrom(this.customerService.getAll());
      this.customers = x;
      let exportData = this.customers;
      saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'customer.json'
      );
    } catch (error) {
      console.error('Error while downloading customer data:', error);
      // You can handle errors here
    }
  }

  async downloadSellData() {
    try {
      const x = await firstValueFrom(this.sellService.getAll());
      this.sells = x;
      let exportData = this.sells;
      saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'sell.json'
      );
    } catch (error) {
      console.error('Error while downloading sell data:', error);
      // You can handle errors here
    }
  }

  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.error('No files selected for upload.');
      return;
    }

    // Iterate through the selected files
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const jsonData = JSON.parse(e.target.result);

        // Identify the file content based on its structure
        if (this.isProductData(jsonData)) {
          this.handleProductUpload(jsonData);
        } else if (this.isCustomerData(jsonData)) {
          this.handleCustomerUpload(jsonData);
        } else if (this.isSellData(jsonData)) {
          this.handleSellUpload(jsonData);
        } else {
          console.error('Unrecognized JSON data:', jsonData);
        }
      };

      reader.readAsText(file);
    }
  }

  private isProductData(data: any): boolean {
    // Implement logic to identify product data based on its structure
    // Example: Check if data contains product-related fields
    return data && data.length > 0 && 'productName' in data[0];
  }

  private isCustomerData(data: any): boolean {
    // Implement logic to identify customer data based on its structure
    // Example: Check if data contains customer-related fields
    return data && data.length > 0 && 'customerName' in data[0];
  }

  private isSellData(data: any): boolean {
    // Implement logic to identify sell data based on its structure
    // Example: Check if data contains sell-related fields
    return data && data.length > 0 && 'items' in data[0];
  }

  // Handle product, customer, and sell data as needed
  private handleProductUpload(productData: any): void {
    this.productService.uploadProductData(productData).subscribe(() => {
      console.log('Product data uploaded successfully.');
      this.app.noty.notifyClose('Product data uploaded successfully.');
    });
  }

  private handleCustomerUpload(customerData: any): void {
    this.customerService.uploadCustomerData(customerData).subscribe(() => {
      console.log('Customer data uploaded successfully.');
      this.app.noty.notifyClose('Customer data uploaded successfully.');
    });
  }

  private handleSellUpload(sellData: any): void {
    this.sellService.uploadSellData(sellData).subscribe(() => {
      console.log('Sell data uploaded successfully.');
      this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }
  // Upload Function is end here

  // Data Download by Date Range

  exportProductDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    // Call your ProductService to get the product data based on the selected date range
    this.productService
      .getProductByDate(startDate, endDate)
      .subscribe((data) => {
        this.exportData(data, 'product.json');
      });
  }

  exportCustomerDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    // Call your ProductService to get the product data based on the selected date range
    this.customerService
      .getCustomerByDate(startDate, endDate)
      .subscribe((x) => {
        this.exportData(x, 'customer.json');
      });
  }

  exportSellDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    // Call your ProductService to get the product data based on the selected date range
    this.sellService.getSellByDate(startDate, endDate).subscribe((x) => {
      this.exportData(x, 'sell.json');
    });
  }

  //download file here ..
  exportData(data: any, fileName: string) {
    return saveAs(
      new Blob([JSON.stringify(data, null, 2)], { type: 'JSON' }),
      fileName
    );
  }

  async deleteProductData() {
    await this.downloadProductData();

    try {
      await firstValueFrom(this.productService.deleteAllProduct());
      this.app.noty.notifyClose('Data download and delete.');
    } catch (error) {}
  }

  async deleteCustomerData() {
    await this.downloadCustomerData();

    try {
      await firstValueFrom(this.customerService.deleteAllCustomer());
      this.app.noty.notifyClose('Data download and delete.');
    } catch (error) {}
  }

  async deleteSellData() {
    await this.downloadSellData();

    try {
      await firstValueFrom(this.sellService.deleteAllSell());
      this.app.noty.notifyClose('Data download and delete.');
    } catch (error) {}
  }

  async deleteProductDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    try {
      // Call your ProductService to get the product data based on the selected date range
      const productData = await firstValueFrom(
        this.productService.getProductByDate(startDate, endDate)
      );

      // Export the product data to a file
      this.exportDataFile(productData, 'product.json');

      // After exporting, delete the product data by date range
      const deleteResult = await firstValueFrom(
        this.productService.deleteProductByDate(startDate, endDate)
      );

      // Check the deleteResult if necessary

      this.app.noty.notifyClose('Product data deleted successfully.');
    } catch (error) {
      console.error('Error while exporting and deleting product data:', error);
      // Handle errors here
    }
  }

  async deleteCustomerDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    try {
      // Call your ProductService to get the product data based on the selected date range
      const customerData = await firstValueFrom(
        this.customerService.getCustomerByDate(startDate, endDate)
      );

      // Export the product data to a file
      this.exportDataFile(customerData, 'customer.json');

      // After exporting, delete the product data by date range
      const deleteResult = await firstValueFrom(
        this.customerService.deleteCustomerByDate(startDate, endDate)
      );

      // Check the deleteResult if necessary

      this.app.noty.notifyClose('Customer data deleted successfully.');
    } catch (error) {
      console.error('Error while exporting and deleting Customer data:', error);
      // Handle errors here
    }
  }

  async deleteSellDataByDate() {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    try {
      // Call your ProductService to get the product data based on the selected date range
      const sellData = await firstValueFrom(
        this.sellService.getSellByDate(startDate, endDate)
      );

      // Export the product data to a file
      this.exportDataFile(sellData, 'sell.json');

      // After exporting, delete the product data by date range
      const deleteResult = await firstValueFrom(
        this.sellService.deleteSellByDate(startDate, endDate)
      );

      // Check the deleteResult if necessary

      this.app.noty.notifyClose('Sell data deleted successfully.');
    } catch (error) {
      console.error('Error while exporting and deleting sell data:', error);
      // Handle errors here
    }
  }

  // Export Data
  async exportDataFile(data: any, fileName: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'JSON' });
    saveAs(blob, fileName);
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogComponent, {
      width: '400px', // Adjust the width as needed
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete file',
        dialogContent: 'Would you like to delete cat.jpeg?',
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        color: 'warn', // Change color as needed
      },
    });
  }
  
}
