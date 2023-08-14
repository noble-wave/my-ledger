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



@NgModule({
  declarations: [
    ProtectedComponent,
    CustomerComponent,
    ProductComponent,
    OrderComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductListComponent,
    CustomerListComponent
  ],
  imports: [
    CoreModule,
    SharedServicesModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: ProtectedComponent,
        children: [
          { path: 'customer', component:CustomerListComponent},
          { path: 'customer/new', component: CustomerComponent },

          { path: 'product', component: ProductListComponent },
          { path: 'product/new', component: ProductComponent },
          { path: 'product/:id', component: ProductComponent },

          { path: 'product-price', component: ProductPriceComponent },
          { path: 'product-inventory', component: ProductInventoryComponent },
          { path: 'order', component: OrderComponent },
        ]
      }
    ])
  ]
})
export class ProtectedModule { }
