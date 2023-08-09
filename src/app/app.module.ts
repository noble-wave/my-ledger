import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedServicesModule } from './shared-services';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './services/storage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    SharedServicesModule.forRoot(),

    NgxIndexedDBModule.forRoot(dbConfig),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
