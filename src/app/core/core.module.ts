import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';
import { PageTitleBarComponent } from './page-title-bar/page-title-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

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
    RouterModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  exports: [
    AppNavComponent
  ],
  providers: [
  ]
})
export class CoreModule { }
