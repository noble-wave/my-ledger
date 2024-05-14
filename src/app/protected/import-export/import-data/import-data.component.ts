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
      this.app.noty.notifyError('No files selected for upload.');
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
      //     // } else if (jsonData && jsonData.products && jsonData.inventory) {
      //     //   this.handleProductUpload(jsonData.products, jsonData.inventory);
      //   } else if (this.isCustomerData(jsonData)) {
      //     this.handleCustomerUpload(jsonData);
      //   } else {
      //     this.app.noty.notifyError('Unrecognized JSON data:');
      //   }
      // };
      reader.onload = (e: any) => {
        const content = e.target.result;

        Papa.parse(content, {
          header: true,
          complete: (result) => {
            const data = result.data;
            if (this.isSellItmesData(data)) {
              this.handleSellItemsUpload(data);
            } else if (this.isSellPaymentsData(data)) {
              this.handleSellPaymentUpload(data);
            } else if (this.isSellData(data)) {
              this.handleSellUpload(data);
            } else if (this.isProductInventoryData(data)) {
              this.handleProductInventoryUpload(data);
            } else if (this.isProductData(data)) {
              this.handleProductUpload(data);
            } else if (this.isCustomerData(data)) {
              this.handleCustomerUpload(data);
            } else {
              this.app.noty.notifyError('Unrecognized CSV data:');
            }
          },
          error: (error) => {
            this.app.noty.notifyError('Error parsing CSV:');
          },
        });
      };

      reader.readAsText(file);
    }
  }

  // Check if CSV data represents in data
  private isSellItmesData(data: any): boolean {
    // Implement logic to identify product data based on its structure
    // Example: Check if data contains product-related fields
    return data && data.length > 0 && 'sellItemId' in data[0];
  }
  private isSellPaymentsData(data: any): boolean {
    return data && data.length > 0 && 'paymentId' in data[0];
  }

  private isSellData(data: any): boolean {
    return data && data.length > 0 && 'sellId' in data[0];
  }
  private isProductInventoryData(data: any): boolean {
    return data && data.length > 0 && 'count' in data[0];
  }

  private isProductData(data: any): boolean {
    return data && data.length > 0 && 'productId' in data[0];
  }

  private isCustomerData(data: any): boolean {
    return data && data.length > 0 && 'customerId' in data[0];
  }

  // Handle uploading product data
  private handleProductUpload(products: any): void {
    this.productService.uploadProductData(products).subscribe(
      () => {
        this.app.noty.notifyClose('Product data uploaded successfully.');
      },
      (error) => {
        this.app.noty.notifyError('Error uploading product data:');
      }
    );
  }
  // Handle uploading product data
  private handleProductInventoryUpload(productInventory: any): void {
    this.productService.uploadProductInventoryData(productInventory).subscribe(
      () => {
        this.app.noty.notifyClose(
          'Product inventory data uploaded successfully.'
        );
      },
      (error) => {
        this.app.noty.notifyError('Error uploading product inventory:');
      }
    );
  }

  // Handle uploading customer data
  private handleCustomerUpload(customerData: any): void {
    this.customerService.uploadCustomerData(customerData).subscribe(() => {
      this.app.noty.notifyClose('Customer data uploaded successfully.');
    });
  }

  // Handle uploading sell data
  private handleSellUpload(sellData: any): void {
    this.sellService.uploadSellData(sellData).subscribe(() => {
      this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }

  // Handle uploading sell data
  private handleSellItemsUpload(sellData: any): void {
    this.sellService.uploadSellItemsData(sellData).subscribe(() => {
      this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }

  // Handle uploading sell data
  private handleSellPaymentUpload(sellData: any): void {
    this.sellService.uploadSellPaymentsData(sellData).subscribe(() => {
      this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }
}
