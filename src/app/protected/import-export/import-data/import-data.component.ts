import { Component } from '@angular/core';
import { CustomerService } from '@app/protected/services/customer.service';
import { ProductService } from '@app/protected/services/product.service';
import { SellService } from '@app/protected/services/sell.service';
import { AppService } from '@app/services/app.service';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
})
export class ImportDataComponent {
  selectedFiles: FileList | null = null;
  customers: any;
  products: any;
  sells: any;

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private sellService: SellService,
    private app: AppService
  ) {}

  ngOnInit(): void {}

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

      // reader.onload = (e: any) => {
      //   const jsonData = JSON.parse(e.target.result);

      //   // Identify the file content based on its structure
      //   if (this.isSellData(jsonData)) {
      //     this.handleSellUpload(jsonData);
      //   } else if (jsonData && jsonData.products && jsonData.inventory) {
      //     this.handleProductUpload(jsonData.products, jsonData.inventory);
      //   } else if (this.isCustomerData(jsonData)) {
      //     this.handleCustomerUpload(jsonData);
      //   } else {
      //     console.error('Unrecognized JSON data:', jsonData);
      //     this.app.noty.notifyError('Unrecognized JSON data:');
      //   }
      // };
      reader.onload = (e: any) => {
        const content = e.target.result;

        Papa.parse(content, {
          header: true,
          complete: (result) => {
            const data = result.data;
            if (this.isSellData(data)) {
              this.handleSellUpload(data);
            } else if (this.isProductInventoryData(data)) {
              this.handleProductInventoryUpload(data);
            } else if (this.isProductData(data)) {
              this.handleProductUpload(data);
            } else if (this.isCustomerData(data)) {
              this.handleCustomerUpload(data);
            } else {
              console.error('Unrecognized CSV data:', data);
              this.app.noty.notifyError('Unrecognized CSV data:');
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            this.app.noty.notifyError('Error parsing CSV:');
          },
        });
      };

      reader.readAsText(file);
    }
  }

  // Check if JSON data represents product data
  private isProductInventoryData(data: any): boolean {
    // Implement logic to identify product data based on its structure
    // Example: Check if data contains product-related fields
    return data && data.length > 0 && 'count' in data[0];
  }
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
  private handleProductUpload(products: any): void {
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
  }
  // Handle uploading product data
  private handleProductInventoryUpload(productInventory: any): void {
   this.productService.uploadProductInventoryData(productInventory).subscribe(
    () => {
      console.log('Product inventory data uploaded successfully.');
      this.app.noty.notifyClose(
        'Product inventory data uploaded successfully.'
      );
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
}
