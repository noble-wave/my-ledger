import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '@app/services/app.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-dummy-data-loader',
  templateUrl: './dummy-data-loader.component.html',
  styleUrls: ['./dummy-data-loader.component.scss']
})
export class DummyDataLoaderComponent {
  @Output() dataUploaded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private app: AppService,
    private customerService: CustomerService,
    private productService: ProductService,
    private sellService: SellService
  ) {}

  // Upload sample JSON files from assets/ledger-data
  uploadSampleData(): void {
    const fileNames = ['customer.json', 'product.json', 'sell.json'];

    fileNames.forEach((fileName) => {
      const filePath = `assets/ledger-data/${fileName}`;

      this.http.get(filePath).pipe(
        map((jsonData) => {
          // Identify the file content based on its structure
          if (this.isSellData(jsonData)) {
            this.handleSellUpload(jsonData);
          } else if (this.isProductData(jsonData)) {
            this.handleProductUpload(jsonData);
          } else if (this.isCustomerData(jsonData)) {
            this.handleCustomerUpload(jsonData);
          } else {
            console.error('Unrecognized JSON data:', jsonData);
            this.app.noty.notifyError('Unrecognized JSON data:');
          }
        }),
        catchError((error) => {
          console.error(`Error reading file ${fileName}:`, error);
          return of(null);
        })
      ).subscribe();
    });

    // Emit event indicating data upload
    this.dataUploaded.emit();
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
 // dummy-data-loader.component.ts
private handleProductUpload(jsonData: any): void {
  // Assuming jsonData is an array containing both products and inventory
  const products = jsonData.products;
  const inventory = jsonData.inventory;

  // Rest of the method remains unchanged
  this.productService.uploadProductData(products).subscribe(
    // ... rest of the code
  );

  this.productService.uploadProductInventoryData(inventory).subscribe(
    // ... rest of the code
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
