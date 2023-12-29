import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AppService } from '@app/services/app.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { SellService } from '../services/sell.service';

@Component({
  selector: 'app-dummy-data-loader',
  templateUrl: './dummy-data-loader.component.html',
  styleUrls: ['./dummy-data-loader.component.scss'],
})
export class DummyDataLoaderComponent implements OnInit {
  loading: boolean = true;
  dataPresent: boolean = false;

  constructor(
    private http: HttpClient,
    private app: AppService,
    private customerService: CustomerService,
    private productService: ProductService,
    private sellService: SellService
  ) {}

  ngOnInit(): void {

    this.sellService.isDataPresent().subscribe((dataPresent) => {
      this.dataPresent = dataPresent;

      if (!dataPresent) {
        this.uploadFiles();
      } else {
        this.loading = false;
      }
    });
  }

  uploadFiles(): void {
    const folderPath = 'assets/ledger-data';
    const fileNames = ['product.json', 'sell.json', 'customer.json'];

    fileNames.forEach((fileName) => {
      const filePath = `${folderPath}/${fileName}`;

      this.http
        .get(filePath)
        .pipe(
          catchError((error) => {
            console.error(`Error reading file ${filePath}:`, error);
            return [];
          })
        )
        .subscribe((jsonData: any) => {
          this.handleFileUpload(fileName, jsonData);
        });
    });
  }

  // Handle file upload based on content
  private handleFileUpload(fileName: string, jsonData: any): void {
    if (this.isSellData(jsonData)) {
      this.handleSellUpload(jsonData);
    } else if (jsonData && jsonData.products && jsonData.inventory) {
      this.handleProductUpload(jsonData.products, jsonData.inventory);
    } else if (this.isCustomerData(jsonData)) {
      this.handleCustomerUpload(jsonData);
    } else {
      this.loading = false;
      console.error('Unrecognized JSON data:', jsonData);
      this.app.noty.notifyError('Unrecognized JSON data:');
    }
    // this.loading = false;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    
    if (this.dataPresent) {
      this.app.noty.notifyClose('dummy-data uploaded successfully.');
    }
  
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
        // this.app.noty.notifyClose('Product data uploaded successfully.');
      },
      (error) => {
        console.error('Error uploading product data:', error);
        this.app.noty.notifyError('Error uploading product data:');
      }
    );

    this.productService.uploadProductInventoryData(inventory).subscribe(
      () => {
        console.log('Product inventory data uploaded successfully.');
        // this.app.noty.notifyClose(
        //   'Product inventory data uploaded successfully.'
        // );
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
      // this.app.noty.notifyClose('Customer data uploaded successfully.');
    });
  }

  // Handle uploading sell data
  private handleSellUpload(sellData: any): void {
    this.sellService.uploadSellData(sellData).subscribe(() => {
      console.log('Sell data uploaded successfully.');
      // this.app.noty.notifyClose('Sell data uploaded successfully.');
    });
  }
}
