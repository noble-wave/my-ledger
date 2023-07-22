import { NgModule } from '@angular/core';
import { SharedServicesModule } from '@app/shared-services';
import { SharedModule } from '@app/shared';



@NgModule({
  declarations: [],
  imports: [
    SharedServicesModule,
    SharedModule,
  ]
})
export class ProtectedModule { }
