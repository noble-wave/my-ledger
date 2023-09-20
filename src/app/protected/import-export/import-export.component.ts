import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { saveAs } from 'file-saver';
import { AppService } from '@app/services/app.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss'],
})
export class ImportExportComponent {
  selectedFiles: FileList | null = null;
  settings: any;
  customers: any;
  products: any;
  orders: any;
  downloadJsonHref: any;
  startDate: string = '';
  endDate: string = '';

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
  productData() {
    this.productService.getAll().subscribe((x) => {
      this.products = x;
      let exportData = this.products;
      return saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'product.json'
      );
    });
  }

  customerData() {
    this.customerService.getAll().subscribe((x) => {
      this.customers = x;
      let exportData = this.customers;
      return saveAs(
        new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
        'customer.json'
      );
    });
  }

  orderData() {
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

  exportDataByDate(dataType: string) {
    if (!this.startDate || !this.endDate) {
      console.error('Please select both start and end dates.');
      return;
    }

    if (dataType === 'product') {
      this.productService.getDataByDate(this.startDate, this.endDate).subscribe((x) => {
        // Handle the exported product data
        // Similar to your existing exportData() method
      });
    } else if (dataType === 'customer') {
      this.customerService.getDataByDate(this.startDate, this.endDate).subscribe((x) => {
        // Handle the exported customer data
        // Similar to your existing customerData() method
      });
    } else if (dataType === 'order') {
      this.orderService.getDataByDate(this.startDate, this.endDate).subscribe((x) => {
        // Handle the exported order data
        // Similar to your existing orderData() method
      });
    }
  }
}
