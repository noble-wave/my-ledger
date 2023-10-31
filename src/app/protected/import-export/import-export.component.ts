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

  // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
  async downloadProductData() {
    try {
      const x = await firstValueFrom(this.productService.getAll());
      const y = await firstValueFrom(this.productService.getAllInventory());

      const combinedData = {
        products: x,
        inventory: y,
      };
      // this.products = x;
      // let exportData = this.products;
      saveAs(
        new Blob([JSON.stringify(combinedData, null, 2)], { type: 'JSON' }),
        'product.json'
      );
      this.app.noty.notifyClose('Product data exported successfully.');
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
      this.app.noty.notifyClose('Customer data exported successfully.');
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
      this.app.noty.notifyClose('Sell data exported successfully.');
    } catch (error) {
      console.error('Error while downloading sell data:', error);
      // You can handle errors here
    }
  }

  // Handle file selection for upload
  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }

  // Upload selected JSON files
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
        if (this.isSellData(jsonData)) {
          this.handleSellUpload(jsonData);
        } else if (jsonData && jsonData.products && jsonData.inventory) {
          this.handleProductUpload(jsonData.products, jsonData.inventory);
        } else if (this.isCustomerData(jsonData)) {
          this.handleCustomerUpload(jsonData);
        } 
        else {
          console.error('Unrecognized JSON data:', jsonData);
        }
      };

      reader.readAsText(file);
    }
  }

  // Check if JSON data represents product data
  private isProductData(data: any): boolean {
    // Implement logic to identify product data based on its structure
    // Example: Check if data contains product-related fields
    return data && data.length > 0 && 'productId' in data[0];
  }

  // Check if JSON data represents customer data
  private isCustomerData(data: any): boolean {
    return data && data.length > 0 && 'customerId' in data[0];
  }

  // Check if JSON data represents sell data
  private isSellData(data: any): boolean {
    return data && data.length > 0 && 'sellId' in data[0];
  }

  // Handle uploading product data
  private handleProductUpload(products: any[], inventory: any[]): void {
    this.productService.uploadProductData(products).subscribe(
      () => {
        console.log('Product data uploaded successfully.');
        this.app.noty.notifyClose('Product data uploaded successfully.');
      },
      (error) => {
        console.error('Error uploading product data:', error);
        this.app.noty.notifyError('Error uploading product data:');
      }
    );
  
    this.productService.uploadProductInventoryData(inventory).subscribe(
      () => {
        console.log('Product inventory data uploaded successfully.');
        this.app.noty.notifyClose('Product inventory data uploaded successfully.');
      },
      (error) => {
        console.error('Error uploading product inventory:', error);
        this.app.noty.notifyError('Error uploading product inventory:');
      }
    );
  }

  // Handle uploading customer data
  private handleCustomerUpload(customerData: any): void {
    this.customerService.uploadCustomerData(customerData).subscribe(() => {
      console.log('Customer data uploaded successfully.');
      this.app.noty.notifyClose('Customer data uploaded successfully.');
    });
  }

  // Handle uploading sell data
  private handleSellUpload(sellData: any): void {
    this.sellService.uploadSellData(sellData).subscribe(() => {
      console.log('Sell data uploaded successfully.');
      this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }

  // Export product data based on date range
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
        this.app.noty.notifyClose('Product data exported successfully.');
      });
  }

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
        this.exportData(x, 'customer.json');
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
      this.exportData(x, 'sell.json');
      this.app.noty.notifyClose('Sell data exported successfully.');
    });
  }

  // Generic method to export data as a JSON file
  exportData(data: any, fileName: string) {
    return saveAs(
      new Blob([JSON.stringify(data, null, 2)], { type: 'JSON' }),
      fileName
    );
  }

  // Delete all product data
  async deleteProductData(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete Product Data',
        dialogContent:
          'Are you sure you want to delete the all product data?<br> <br>This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        await this.downloadProductData();

        try {
          await firstValueFrom(this.productService.deleteAllProduct());
          await firstValueFrom(this.productService.deleteAllProductInventory());
          this.app.noty.notifyClose('Data download and delete.');
        } catch (error) {
          // Handle the error, you might want to add error handling code here
        }
      }
    });
  }

  // Delete all customer data
  async deleteCustomerData(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete Customer Data',
        dialogContent:
          'Are you sure you want to delete the all customer data?<br> <br>This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        await this.downloadCustomerData();

        try {
          await firstValueFrom(this.customerService.deleteAllCustomer());
          this.app.noty.notifyClose('Data download and delete.');
        } catch (error) {}
      }
    });
  }

  // Delete all sell data
  async deleteSellData(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete sell Data',
        dialogContent:
          'Are you sure you want to delete the all sell data?<br> <br>This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        await this.downloadSellData();

        try {
          await firstValueFrom(this.sellService.deleteAllSell());
          this.app.noty.notifyClose('Data download and delete.');
        } catch (error) {}
      }
    });
  }

  //  Delete product data based on date range and also Download
  async deleteProductDataByDate(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete Product Data',
        dialogContent:
          'Are you sure you want to delete the product data by date range?<br> <br>This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        try {
          const productData = await firstValueFrom(
            this.productService.getProductByDate(startDate, endDate)
          );

          this.exportDataFile(productData, 'product.json');

          const deleteResult = await firstValueFrom(
            this.productService.deleteProductByDate(startDate, endDate)
          );

          // Check the deleteResult if necessary

          this.app.noty.notifyClose('Product data deleted successfully.');
        } catch (error) {
          console.error(
            'Error while exporting and deleting product data:',
            error
          );
          // Handle errors here
        }
      }
    });
  }

  //  Delete customer data based on date range and also Download
  async deleteCustomerDataByDate(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete Customer Data',
        dialogContent:
          'Are you sure you want to delete the customer data by date range?<br> <br> This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        try {
          const customerData = await firstValueFrom(
            this.customerService.getCustomerByDate(startDate, endDate)
          );

          this.exportDataFile(customerData, 'customer.json');

          const deleteResult = await firstValueFrom(
            this.customerService.deleteCustomerByDate(startDate, endDate)
          );

          // Check the deleteResult if necessary

          this.app.noty.notifyClose('Customer data deleted successfully.');
        } catch (error) {
          console.error(
            'Error while exporting and deleting customer data:',
            error
          );
          // Handle errors here
        }
      }
    });
  }

  //  Delete sell data based on date range and also Download
  async deleteSellDataByDate(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;
    // Ensure you have startDate and endDate as Date objects here

    // Check if the provided dates are valid
    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        dialogTitle: 'Delete Sell Data',
        dialogContent:
          'Are you sure you want to delete the sell data by date range? <br> <br>This action will also download the file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        try {
          // Call your SellService to get the sell data based on the provided date range
          const sellData = await firstValueFrom(
            this.sellService.getSellByDate(startDate, endDate)
          );

          // Export the sell data to a file
          this.exportDataFile(sellData, 'sell.json');

          // After exporting, delete the sell data by date range
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
    });
  }

  // Generic method to export data as a JSON file
  async exportDataFile(data: any, fileName: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'JSON' });
    saveAs(blob, fileName);
  }
}
