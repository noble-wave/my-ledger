import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { saveAs } from 'file-saver';
import { AppService } from '@app/services/app.service';
import { FormControl, FormGroup } from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

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
  orders: any;
  downloadJsonHref: any;

  datePicker = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private app: AppService
  ) {
    // this.generateDownloadJsonUri();
  }

  ngOnInit(): void {}

  // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
  downloadProductData() {
    this.productService.getAll().subscribe((x) => {
      this.products = x;
      let exportData = this.products;
      return saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'product.json'
      );
    });
  }

  downloadCustomerData() {
    this.customerService.getAll().subscribe((x) => {
      this.customers = x;
      let exportData = this.customers;
      return saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'customer.json'
      );
    });
  }

  downloadOrderData() {
    this.orderService.getAll().subscribe((x) => {
      this.orders = x;
      let exportData = this.orders;
      return saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'order.json'
      );
    });
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
        } else if (this.isOrderData(jsonData)) {
          this.handleOrderUpload(jsonData);
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

  private isOrderData(data: any): boolean {
    // Implement logic to identify order data based on its structure
    // Example: Check if data contains order-related fields
    return data && data.length > 0 && 'items' in data[0];
  }

  // Handle product, customer, and order data as needed
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

  private handleOrderUpload(orderData: any): void {
    this.orderService.uploadOrderData(orderData).subscribe(() => {
      console.log('Order data uploaded successfully.');
      this.app.noty.notifyClose('Order data uploaded successfully.');
    });
  }
// Upload Function is end here


// Data Download by Date Range

  exportProductDataByDate(dataType: string) {
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

  exportCustomerDataByDate(dataType: string) {
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

  exportOrderDataByDate(dataType: string) {
    // Retrieve the selected start and end dates from the form control
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    if (!startDate || !endDate) {
      this.app.noty.notifyError('Please select both start and end dates.');
      return;
    }

    // Call your ProductService to get the product data based on the selected date range
    this.orderService
      .getOrderByDate(startDate, endDate)
      .subscribe((x) => {
        this.exportData(x, 'order.json');
      });
  }

  // 
  exportData(data: any, fileName: string) {
    return saveAs(
      new Blob([JSON.stringify(data, null, 2)], { type: 'JSON' }),
      fileName
    );
  }

  
}
