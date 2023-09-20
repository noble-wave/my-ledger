import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { SettingService } from '@app/protected/services/setting.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
})
export class AppNavComponent {
  showFiller: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  setting: any;

  public paths = [
    { path: 'product', label: 'Product' },
    { path: 'customer', label: 'Customer' },
    // { path: 'product-price', label: 'Product Price' },
    // { path: 'product-inventory', label: 'Product Inventory' },
    { path: 'order', label: 'Order List' },
    { path: 'order/new', label: 'Take Order' },
    // { path: 'quickOrder', label: 'Quick Order' },
    { path: 'setting', label: 'Settings' },
    { path: 'import-export', label: 'Import/Export' },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickOrderSetting().subscribe((x) => {
      this.setting = { ...x };
      console.log('Setting data:', this.setting);
        if (this.setting.manageQuickOrder) {
          this.paths.splice(4, 0, { path: 'quickOrder', label: 'Quick Order' });
        } else {
          this.paths = this.paths.filter((item) => item.path !== 'quickOrder');
        }
    });
  }
}
