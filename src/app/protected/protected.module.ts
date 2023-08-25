import { NgModule } from '@angular/core';
import { SharedServicesModule } from '@app/shared-services';
import { SharedModule } from '@app/shared';
import { ProtectedComponent } from './protected.component';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { ProductPriceComponent } from './product-price/product-price.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { ProductListComponent } from './product/product-list.component';
import { CustomerListComponent } from './customer/customer-list.component';
import { OrderListComponent } from './order/order-list.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    ProtectedComponent,
    CustomerComponent,
    ProductComponent,
    OrderComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductListComponent,
    CustomerListComponent,
    OrderListComponent,
  ],
  imports: [
    CoreModule,
    MatBadgeModule,
    SharedServicesModule,
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
          { path: 'order', component: OrderComponent },
          { path: 'order/new', component: OrderListComponent },
        ],
      },
    ]),
  ],
})
export class ProtectedModule {}
