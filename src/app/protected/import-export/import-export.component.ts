import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { saveAs } from 'file-saver';
import { AppService } from '@app/services/app.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent {
  selectedFiles: FileList | null = null;
  settings: any;
  customers: any;
  products: any;
  orders: any;
  downloadJsonHref: any;

  constructor(
    private customer: CustomerService,
    private product: ProductService,
    private order: OrderService,
    private app: AppService,
  ) {
    // this.generateDownloadJsonUri();
  }

  ngOnInit(): void {
    this.customer.getAll().subscribe((x) => {
      this.customers = x;
    });

    this.product.getAll().subscribe((x) => {
      this.products = x;
      console.log(this.products);
    });

    this.order.getAll().subscribe((x) => {
      this.orders = x;
    });
  }

  productData() {
    // exportData is your array which you want to dowanload as json and sample.json is your file name, customize the below lines as per your need.
    let exportData = this.products;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
      'product.json'
    );
  }
  customerData() {
    let exportData = this.customers;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
      'customer.json'
    );
  }
  orderData() {
    let exportData = this.orders;
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }),
      'order.json',
    );
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
  this.product.uploadProductData(productData).subscribe(() => {
      console.log('Product data uploaded successfully.');
      this.app.noty.notifyClose('Product data uploaded successfully.');
  });
}

private handleCustomerUpload(customerData: any): void {
  this.customer.uploadCustomerData(customerData).subscribe(() => {
      console.log('Customer data uploaded successfully.');
      this.app.noty.notifyClose('Customer data uploaded successfully.');
  });
}

private handleOrderUpload(orderData: any): void {
  this.order.uploadOrderData(orderData).subscribe(() => {
      console.log('Order data uploaded successfully.');
      this.app.noty.notifyClose('Order data uploaded successfully.');
  });
}


}




