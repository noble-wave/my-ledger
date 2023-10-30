import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@app/protected/services/product.service';

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.scss'],
})
export class ThresholdComponent {
  warnthreshold: any;
  infothreshold: any;
  allInventory: any;

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.service
      .getInventoryWarnThreshold()
      .subscribe((x) => (this.warnthreshold = x));
    this.service
      .getInventoryInfoThreshold()
      .subscribe((x) => (this.infothreshold = x));
    this.service.getAllInventory().subscribe((x) => (this.allInventory = x));
  }

  saveSell() {}

  navigateToOtherPage(section: string) {
    if (section === 'warn') {
      this.router.navigate(['../warn-inventory'], {
        relativeTo: this.route,
      });
    } else if (section === 'info') {
      this.router.navigate(['../info-inventory'], {
        relativeTo: this.route,
      });
    } else if (section === 'inventory') {
      this.router.navigate(['../product-inventory'], {
        relativeTo: this.route,
      });
    }
  }
}
