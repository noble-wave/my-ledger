import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { RefreshService } from '@app/protected/services/refresh.service';
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
  isDrawerOpen = false;

  public paths = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'report', label: 'Reports' },
    { path: 'product', label: 'Products' },
    { path: 'product-inventory', label: 'Product Inventory' },
    { path: 'customer', label: 'Customers' },
    { path: 'customer-dueAmount', label: 'Customers/Due Amount' },
    { path: 'customer-wallet', label: 'Customers Wallet' },
    { path: 'sell', label: 'Sell List' },
    { path: 'sell/new', label: 'Sell' },
    { path: 'import-export', label: 'Import/Export/Delete' },
    { path: 'setting', label: 'Settings' },
    { path: 'report-issue', label: 'Report-Issue/Suggestion' },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private refreshService: RefreshService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickSellSetting().subscribe((x) => {
      this.setting = { ...x };
      // console.log('Setting data:', this.setting);
      if (this.setting.manageQuickSell) {
        this.paths.splice(7, 0, { path: 'quickSell', label: 'Quick Sell' });
      } else {
        this.paths = this.paths.filter((item) => item.path !== 'quickSell');
      }
    });

    this.refreshService.isChnage$.subscribe((x) => {
      if (x.manageQuickSell) {
        this.paths.splice(7, 0, { path: 'quickSell', label: 'Quick Sell' });
      } else {
        this.paths = this.paths.filter((item) => item.path !== 'quickSell');
      }
    });
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
