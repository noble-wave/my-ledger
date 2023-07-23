import { NgModule } from '@angular/core';
import { SharedServicesModule } from '@app/shared-services';
import { SharedModule } from '@app/shared';
import { ProtectedComponent } from './protected.component';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProtectedComponent
  ],
  imports: [
    CoreModule,
    SharedServicesModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ProtectedComponent }
    ])
  ]
})
export class ProtectedModule { }
