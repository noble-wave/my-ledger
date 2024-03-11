import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '@app/protected/services/customer.service';
import { ProductService } from '@app/protected/services/product.service';
import { SellService } from '@app/protected/services/sell.service';
import { AppService } from '@app/services/app.service';
import { DialogComponent } from '@app/shared/controls/template/dialog/dialog.component';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html',
  styleUrls: ['./delete-data.component.scss'],
})
export class DeleteDataComponent {
  datePicker: FormGroup;
  panelOpenState = false;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
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

  // Generic method to export data as a JSON file
  exportData(csv: any, fileName: string) {
    return saveAs(new Blob([csv], { type: 'text/csv' }), fileName);
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
          'Are you sure you want to delete the all product data?<br> <br>This action will also download deleted data as file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        try {
          // Fetch data to export
          const productData = await firstValueFrom(
            this.productService.getAll()
          );
          const inventoryData = await firstValueFrom(
            this.productService.getAllInventory()
          );

          const csvProducts = Papa.unparse(productData);
          const csvInventory = Papa.unparse(inventoryData);

          this.exportData(csvProducts, 'products.csv');
          this.exportData(csvInventory, 'productInventorys.csv');

          // Delete data
          await firstValueFrom(this.productService.deleteAllProduct());
          await firstValueFrom(this.productService.deleteAllProductInventory());
          this.app.noty.notifyClose(
            'Product data downlaoded and deleted successfully'
          );
        } catch (error) {
          this.app.noty.notifyError('Something goes worng.');
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
          'Are you sure you want to delete the all customer data?<br> <br>This action will also download deleted data as file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        // await this.downloadCustomerData();

        try {
          const customerData = await firstValueFrom(
            this.customerService.getAll()
          );
          const csv = Papa.unparse(customerData);
          this.exportData(csv, 'customer.csv');

          const deleteResult = await firstValueFrom(
            this.customerService.deleteAllCustomer()
          );

          this.app.noty.notifyClose(
            'Customer data downlaoded and deleted successfully.'
          );
        } catch (error) {
          this.app.noty.notifyError('Something goes worng.');
        }
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
          'Are you sure you want to delete the all sell data?<br> <br>This action will also download deleted data as file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        // await this.downloadSellData();

        try {
          // Call your SellService to get the sell data based on the provided date range
          const sells = await firstValueFrom(this.sellService.getAll());
          const sellItems = await firstValueFrom(this.sellService.getAllSellItem());
          const sellPayments = await firstValueFrom(this.sellService.getAllSellPayment());

          // Export the sell data to a file
          const csvSells = Papa.unparse(sells);
          const csvSellItems = Papa.unparse(sellItems);
          const csvSellPayments = Papa.unparse(sellPayments);

          this.exportData(csvSells, 'sells.csv');
          this.exportData(csvSellItems, 'sellItems.csv');
          this.exportData(csvSellPayments, 'sellPayments.csv');

          // After exporting, delete the sell data by date range
          const deleteResult = await firstValueFrom(
            forkJoin([
                this.sellService.deleteAllSell(),
                this.sellService.deleteAllSellItems(),
                this.sellService.deleteAllSellPayment()
            ])
        );
        
          // Check the deleteResult if necessary

          this.app.noty.notifyClose(
            'Sell data downlaoded and deleted successfully.'
          );
        } catch (error) {
          this.app.noty.notifyError('Something goes worng.');
        }
      }
    });
  }

  //  Delete product data based on date range and also Download
  async deleteProductAndInventoryDataByDateAndDownload(
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
        dialogTitle: 'Delete Product and Inventory Data',
        dialogContent:
          'Are you sure you want to delete the product and inventory data by date range?<br> <br>This action will also download deleted data as file.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'true') {
        try {
          // Fetch data to export
          const productData = await firstValueFrom(
            this.productService.getProductByDate(startDate, endDate)
          );
          const inventoryData = await firstValueFrom(
            this.productService.getProductInventoryByDate(startDate, endDate)
          );

          const csvProducts = Papa.unparse(productData);
          const csvInventory = Papa.unparse(inventoryData);

          this.exportData(csvProducts, 'products.csv');
          this.exportData(csvInventory, 'productInventorys.csv');

          // Delete data
          await firstValueFrom(
            this.productService.deleteProductInventoryByDate(startDate, endDate)
          );
          await firstValueFrom(
            this.productService.deleteProductByDate(startDate, endDate)
          );

          this.app.noty.notifyClose(
            'Product and Inventory data deleted successfully.'
          );
        } catch (error) {
          console.error(
            'Error while exporting and deleting product and inventory data:',
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
          'Are you sure you want to delete the customer data by date range?<br> <br> This action will also download deleted data as file.',
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

          const csv = Papa.unparse(customerData);
          this.exportData(csv, 'customer.csv');

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
          'Are you sure you want to delete the sell data by date range? <br> <br>This action will also download deleted data as file.',
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
          const sellItmes = await firstValueFrom(
            this.sellService.getSellItemsByDate(startDate, endDate)
          );
          const sellPayments = await firstValueFrom(
            this.sellService.getSellPaymentsByDate(startDate, endDate)
          );


          // Export the sell data to a file
          const csv = Papa.unparse(sellData);
          const csvsellItmes = Papa.unparse(sellItmes);
          const csvsellPayments = Papa.unparse(sellPayments);

          this.exportData(csv, 'sell.csv');
          this.exportData(csvsellItmes, 'sellItmes.csv');
          this.exportData(csvsellPayments, 'sellPayments.csv');

          // After exporting, delete the sell data by date range
          await firstValueFrom(
            this.sellService.deleteSellByDate(startDate, endDate)
          );
          await firstValueFrom(
            this.sellService.deleteSellItemsByDate(startDate, endDate)
          );
          await firstValueFrom(
            this.sellService.deleteSellPaymentByDate(startDate, endDate)
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
}
