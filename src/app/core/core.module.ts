import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';
import { PageTitleBarComponent } from './page-title-bar/page-title-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SharedModule } from '@app/shared';
import { CoreService } from './core.service';

const routes: Routes = [
];

@NgModule({
  declarations: [
    AppNavComponent,
    TopBarComponent,
    PageTitleBarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  exports: [
    AppNavComponent
  ],
  providers: [
    CoreService
  ]
})
export class CoreModule { }
