import { Component } from '@angular/core';
import { ProductService } from '@app/protected/services/product.service';
import { Subject, forkJoin, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-amount-track',
  templateUrl: './product-amount-track.component.html',
  styleUrls: ['./product-amount-track.component.scss'],
})
export class ProductAmountTrackComponent {
  private destroy$: Subject<void> = new Subject<void>();
  totalSaleAmount: number;
  totalPurchaseAmount: number;
  processedData: any;

  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  getData() {
    forkJoin([this.service.getAllInventory(), this.service.getAll()])
      .pipe(
        map((res: any[]) => {
          let pri = res[0];
          let pr = res[1];

          pr.forEach((x) => {
            x['count'] = pri.find((y) => y.productId == x.productId)?.count;
          });

          this.totalSaleAmount = pr?.reduce(
            (a, b) => a + (Number(b.price) * Number(b.count) || 0),
            0
          );

          this.totalPurchaseAmount = pr?.reduce(
            (a, b) => a + (Number(b.purchaseCost) * Number(b.count) || 0),
            0
          );

          return pr;
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
