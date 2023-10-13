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
    { path: 'product', label: 'Products' },
    { path: 'customer', label: 'Customers' },
    // { path: 'product-price', label: 'Product Price' },
    // { path: 'product-inventory', label: 'Product Inventory' },
    { path: 'sell', label: 'Sells List' },
    { path: 'sell/new', label: 'Sell' },
    // { path: 'quickSell', label: 'Quick Sell' },
    { path: 'import-export', label: 'Import/Export/Delete' },
    { path: 'report', label: 'Reports' },
    { path: 'setting', label: 'Settings' },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickSellSetting().subscribe((x) => {
      this.setting = { ...x };
      console.log('Setting data:', this.setting);
        if (this.setting.manageQuickSell) {
          this.paths.splice(3, 0, { path: 'quickSell', label: 'Quick Sell' });
        } else {
          this.paths = this.paths.filter((item) => item.path !== 'quickSell');
        }
    });
  }
}
