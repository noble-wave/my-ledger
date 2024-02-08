import { Component } from '@angular/core';
import { Sell } from '@app/models/sell.model';
import { SellService } from '@app/protected/services/sell.service';

@Component({
  selector: 'app-sale-dashboard',
  templateUrl: './sale-dashboard.component.html',
  styleUrls: ['./sale-dashboard.component.scss']
})
export class SaleDashboardComponent {

  sells: Sell[] = [];
  last30DaysNetAmount: number = 0;
  last90DaysNetAmount: number = 0;
  allTimeNetAmount: number = 0;

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.sellService.getAll().subscribe((sells: Sell[]) => {
      this.sells = sells;
      this.calculateNetAmounts();
    });
  }

  calculateNetAmounts() {
    let currentDate = new Date();
    let last30DaysDate = new Date(currentDate);
    last30DaysDate.setDate(currentDate.getDate() - 30);

    let last90DaysDate = new Date(currentDate);
    last90DaysDate.setDate(currentDate.getDate() - 90);

    this.last30DaysNetAmount = this.calculateNetAmountInRange(last30DaysDate, currentDate);
    this.last90DaysNetAmount = this.calculateNetAmountInRange(last90DaysDate, currentDate);
    this.allTimeNetAmount = this.calculateNetAmountInRange(new Date(0), currentDate);
  }

  calculateNetAmountInRange(startDate: Date, endDate: Date): number {
    return this.sells
      .filter(sell => {
        let sellDate = new Date(sell.sellDate);
        return sellDate >= startDate && sellDate <= endDate;
      })
      .reduce((totalNetAmount, sell) => totalNetAmount + Number(sell.netAmount), 0);
  }

}
