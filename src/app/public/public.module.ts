import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { CoreModule } from '../core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LoginComponent, HomeComponent, PublicComponent],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      // {
      //   path: '',
      //   component: PublicComponent,
      //   children: [
      //     { path: '', component: HomeComponent },
      //     { path: 'login', component: LoginComponent },
      //   ],
      // },
    ]),
    CoreModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    SocialLoginModule,
    FlexLayoutModule,
  ],
})
export class PublicModule {}
