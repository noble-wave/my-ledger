import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent {
  showFiller: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public paths = [
    { path: 'product', label: 'Product' },
    { path: 'customer', label: 'Customer' },
    { path: 'product-price', label: 'Product Price' },
    { path: 'product-inventory', label: 'Product Inventory' },
    { path: 'order', label:'Order'}
  ]

  constructor(private breakpointObserver: BreakpointObserver) { }

}
