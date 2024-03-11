import { NgModule } from '@angular/core';
import { SharedServicesModule } from '@app/shared-services';
import { SharedModule } from '@app/shared';
import { ProtectedComponent } from './protected.component';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { SellComponent } from './sell/sell.component';
import { ProductPriceComponent } from './product-price/product-price.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { ProductListComponent } from './product/product-list.component';
import { CustomerListComponent } from './customer/customer-list.component';
import { SellListComponent } from './sell/sell-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ViewSellComponent } from './sell/view-sell.component';
import { SettingComponent } from './setting/setting.component';
import { ImportExportComponent } from './import-export/import-export.component';
import { QuickSellComponent } from './sell/quick-sell/quick-sell.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportComponent } from './report/report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SaleDashboardComponent } from './dashboard/sale-dashboard/sale-dashboard.component';
import { ThresholdComponent } from './dashboard/threshold/threshold.component';
import { WarnInventoryComponent } from './product-inventory/warn-inventory/warn-inventory.component';
import { InfoInventoryComponent } from './product-inventory/info-inventory/info-inventory.component';
import { DummyDataLoaderComponent } from './dummy-data-loader/dummy-data-loader.component';
import { DueBalanceComponent } from './dashboard/due-balance/due-balance.component';
import { CustomerDueAmountComponent } from './customer/customer-due-amount/customer-due-amount.component';
import { CustomerPaymentComponent } from './customer/customer-payment/customer-payment.component';
import { PaymentComponent } from './customer/customer-payment/payment/payment.component';
import { ViewPaymentComponent } from './customer/customer-payment/view-payment/view-payment.component';
import { SetteldSellListComponent } from './customer/customer-payment/settled-sell-list/settled-sell-list.component';
import { MatListModule } from '@angular/material/list';
import { QRCodeModule } from 'angularx-qrcode';
import { ImportDataComponent } from './import-export/import-data/import-data.component';
import { ExportDataComponent } from './import-export/export-data/export-data.component';
import { DeleteDataComponent } from './import-export/delete-data/delete-data.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';

@NgModule({
  declarations: [
    ProtectedComponent,
    CustomerComponent,
    ProductComponent,
    SellComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductListComponent,
    CustomerListComponent,
    SellListComponent,
    ViewSellComponent,
    SettingComponent,
    ImportExportComponent,
    QuickSellComponent,
    ReportComponent,
    DashboardComponent,
    SaleDashboardComponent,
    ThresholdComponent,
    WarnInventoryComponent,
    InfoInventoryComponent,
    DummyDataLoaderComponent,
    DueBalanceComponent,
    CustomerDueAmountComponent,
    CustomerPaymentComponent,
    PaymentComponent,
    ViewPaymentComponent,
    SetteldSellListComponent,
    ImportDataComponent,
    ExportDataComponent,
    DeleteDataComponent,
    ReportIssueComponent,
  ],
  imports: [
    QRCodeModule,
    CoreModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDatepickerModule,
    SharedServicesModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatListModule,
    NgxChartsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProtectedComponent,
        children: [
          { path: 'customer', component: CustomerListComponent },
          { path: 'customer/new', component: CustomerComponent },
          { path: 'customer/:id', component: CustomerComponent },

          { path: 'product', component: ProductListComponent },
          { path: 'product/new', component: ProductComponent },
          { path: 'product/:id', component: ProductComponent },

          { path: 'product-price', component: ProductPriceComponent },
          { path: 'product-inventory', component: ProductInventoryComponent },
          { path: 'warn-inventory', component: WarnInventoryComponent },
          { path: 'info-inventory', component: InfoInventoryComponent },

          { path: 'sell/new', component: SellComponent },
          { path: 'sell', component: SellListComponent },
          { path: 'sell/view/:sellId', component: ViewSellComponent },
          { path: 'quickSell', component: QuickSellComponent },

          { path: 'setting', component: SettingComponent },
          { path: 'import-export', component: ImportExportComponent },
          { path: 'report', component: ReportComponent },
          { path: 'report-issue', component: ReportIssueComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'dummy-data-loader', component: DummyDataLoaderComponent },

          { path: 'customer-dueAmount', component: CustomerDueAmountComponent },
          {
            path: 'customer-dueAmount/:customerId',
            component: CustomerPaymentComponent,
          },
          { path: 'payment', component: PaymentComponent },
        ],
      },
    ]),
  ],
})
export class ProtectedModule {}
