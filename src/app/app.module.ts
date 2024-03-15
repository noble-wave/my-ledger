import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedServicesModule } from './shared-services';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './services/storage.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    SharedServicesModule.forRoot(),

    NgxIndexedDBModule.forRoot(dbConfig),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '533038146655-etu6cgcfv25k5nv8trmauf0a2p4i361m.apps.googleusercontent.com',
              {
                oneTapEnabled: true, // default is true
                scopes: 'profile https://www.googleapis.com/auth/drive',
              }
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
