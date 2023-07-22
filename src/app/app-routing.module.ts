import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'pro', loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule) },
  { path: 'home', loadChildren: () => import('./open/open.module').then(m => m.OpenModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
