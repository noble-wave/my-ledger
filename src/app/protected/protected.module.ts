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
  ],
  imports: [
    CoreModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDatepickerModule,
    SharedServicesModule,
    MatAutocompleteModule,
    MatDialogModule,
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

          { path: 'sell/new', component: SellComponent },
          { path: 'sell', component: SellListComponent },
          { path: 'sell/view/:sellId', component: ViewSellComponent },
          { path: 'quickSell', component: QuickSellComponent },

          { path: 'setting', component: SettingComponent },
          { path: 'import-export', component: ImportExportComponent },
        ],
      },
    ]),
  ],
})
export class ProtectedModule {}
