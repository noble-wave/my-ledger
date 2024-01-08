import { Component } from '@angular/core';
import { Sell } from '@app/models/sell.model';
import { SellService } from '@app/protected/services/sell.service';

@Component({
  selector: 'app-due-balance',
  templateUrl: './due-balance.component.html',
  styleUrls: ['./due-balance.component.scss'],
})

export class DueBalanceComponent {
  sells: Sell[] = [];
  last30DaysDueAmount: number = 0;
  last90DaysDueAmount: number = 0;
  allTimeDueAmount: number = 0;

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.sellService.getAll().subscribe((sells: Sell[]) => {
      this.sells = sells;
      this.calculateDueAmounts();
    });
  }

  calculateDueAmounts() {
    let currentDate = new Date();
    let last30DaysDate = new Date(currentDate);
    last30DaysDate.setDate(currentDate.getDate() - 30);
    let last90DaysDate = new Date(currentDate);
    last90DaysDate.setDate(currentDate.getDate() - 90);
    this.last30DaysDueAmount = this.calculateDueAmountInRange(
      last30DaysDate,
      currentDate
    );
    this.last90DaysDueAmount = this.calculateDueAmountInRange(
      last90DaysDate,
      currentDate
    );
    this.allTimeDueAmount = this.calculateDueAmountInRange(
      new Date(0),
      currentDate
    );
  }
  
  calculateDueAmountInRange(startDate: Date, endDate: Date): number {
    return this.sells
      .filter((sell) => {
        let sellDate = new Date(sell.sellDate);
        return sellDate >= startDate && sellDate <= endDate;
      })
      .reduce((dueAmount, sell) => dueAmount + sell.dueAmount, 0);
  }
}
