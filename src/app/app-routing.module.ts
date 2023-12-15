import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './protected/product/product.component';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule) },
  // { path: '**', redirectTo: '/login' }
  { path: '**', redirectTo: '/product' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
