import { HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    HttpClientModule,

    MatSnackBarModule,
  ],
  exports: [
    HttpClientModule,

    MatSnackBarModule,
  ],
  declarations: []
})
export class SharedServicesModule {
  static forRoot(): ModuleWithProviders<SharedServicesModule> {
    return {
      ngModule: SharedServicesModule,
      providers: [
      ]
    };
  }
}
