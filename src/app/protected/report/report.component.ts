import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SellService } from '../services/sell.service';
import { Sell } from '@app/models/sell.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.adjustChartDimensions();
  }

  sells: Sell[] = [];
  chartData: any[] = [];
  lineChartData: { name: string; series: any[] }[] = []; // Line chart data
  theme = 'dark';
  colorScheme = 'cool';
  chartView: [number, number] = [380, 300];
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Sell Date';
  yAxisLabel = 'Sell Amount';
  datePicker: FormGroup;
  panelOpenState = false;
  selectedDateRange: string = 'last2Weeks';
  selectedDateRangeText: string = 'Last two weeks';

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.sellService.getAll().subscribe((sells: Sell[]) => {
      this.sells = sells;
      this.prepareLast2WeeksChartData(); // Initial chart data (yearly)
      this.prepareLineChartData();
      setTimeout(() => {
        this.adjustChartDimensions();
      }, 0);
    });

    // Initialize the date picker with a default date range
    let currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.datePicker = new FormGroup({
      start: new FormControl(currentDate),
      end: new FormControl(new Date()),
    });
  }

  adjustChartDimensions(): void {
    const parentContainer = document.querySelector('.chart-container');

    if (parentContainer) {
      const parentWidth = parentContainer.clientWidth;
      this.chartView = [parentWidth, 400];
    }
  }

  onDateRangeChange() {
    switch (this.selectedDateRange) {
      case 'allYears':
        this.selectedDateRangeText = 'All Years';
        this.prepareYearlyChartData();
        break;
      case 'last6Years':
        this.selectedDateRangeText = 'Last 6 years';
        this.prepareLast6YearsChartData();
        break;
      case 'last6Months':
        this.selectedDateRangeText = 'Last 6 Months';
        this.prepareLast6MonthsChartData();
        break;
      case 'last2Weeks':
        this.selectedDateRangeText = 'Last two weeks';
        this.prepareLast2WeeksChartData();
        break;
      default:
        break;
    }
  }

  addEvent(type: string) {
    if (type === 'year') {
      this.selectedDateRange = 'allYears';
    } else if (type === 'month') {
      this.selectedDateRange = 'lastAndThisMonth';
    } else if (type === 'date') {
      this.prepareChartData();
    }
    this.selectedDateRangeText = 'Default Date Range';
  }

  prepareChartData(): void {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    const filteredSells = this.sells.filter((sell) => {
      const sellDate = new Date(sell.sellDate);
      return sellDate >= startDate && sellDate <= endDate;
    });

    this.chartData = this.prepareChartDataFromSells(filteredSells);
  }

  prepareChartDataFromSells(filteredSells: Sell[]): any[] {
    const dailyTotals: { [key: string]: number } = {};

    for (const sell of filteredSells) {
      const sellDate = new Date(sell.sellDate);

      if (!isNaN(sellDate.getTime())) {
        const netAmount = sell.netAmount;
        const formattedDate = sellDate.toISOString().split('T')[0];
        const existingTotal = dailyTotals[formattedDate] || 0;
        dailyTotals[formattedDate] = existingTotal + netAmount;
      }
    }

    const formattedData: any[] = [];

    for (const date in dailyTotals) {
      if (dailyTotals.hasOwnProperty(date)) {
        formattedData.push({
          name: date,
          value: dailyTotals[date],
        });
      }
    }

    return formattedData;
  }

  prepareYearlyChartData(): void {
    const yearlyData: { [year: string]: number } = {};

    for (const sell of this.sells) {
      const sellDate = new Date(sell.sellDate);
      const year = sellDate.getFullYear().toString();

      if (!yearlyData[year]) {
        yearlyData[year] = 0;
      }

      yearlyData[year] += sell.netAmount;
    }

    this.chartData = Object.keys(yearlyData).map((year) => ({
      name: year,
      value: yearlyData[year],
    }));
  }

  prepareLast6YearsChartData(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const yearlyData: any[] = [];

    for (let i = 0; i < 6; i++) {
      const targetYear = currentYear - i;

      const filteredSells = this.sells.filter((sell) => {
        const sellDate = new Date(sell.sellDate);
        return sellDate.getFullYear() === targetYear;
      });

      const yearlyTotal = filteredSells.reduce(
        (total, sell) => total + sell.netAmount,
        0
      );

      yearlyData.push({
        name: targetYear.toString(),
        value: yearlyTotal,
      });
    }

    this.chartData = yearlyData.reverse();
  }

  prepareLast6MonthsChartData(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthlyData: any[] = [];

    for (let i = 0; i < 6; i++) {
      let targetYear = currentYear;
      let targetMonth = currentMonth - i;

      if (targetMonth < 0) {
        targetYear--;
        targetMonth = 12 + targetMonth;
      }

      const targetDate = new Date(targetYear, targetMonth, 1);

      const filteredSells = this.sells.filter((sell) => {
        const sellDate = new Date(sell.sellDate);
        return (
          sellDate.getFullYear() === targetYear &&
          sellDate.getMonth() === targetMonth
        );
      });

      const monthlyTotal = filteredSells.reduce(
        (total, sell) => total + sell.netAmount,
        0
      );

      monthlyData.push({
        name:
          targetDate.toLocaleString('default', { month: 'long' }) +
          ' ' +
          targetYear,
        value: monthlyTotal,
      });
    }

    this.chartData = monthlyData.reverse();
  }

  prepareLast2WeeksChartData(): void {
    const currentDate = new Date();
    const twoWeeksAgo = new Date(
      currentDate.getTime() - 14 * 24 * 60 * 60 * 1000
    ); // Subtract 14 days in milliseconds
    const dailyData: any[] = [];

    for (
      let date = new Date(twoWeeksAgo);
      date <= currentDate;
      date.setDate(date.getDate() + 1)
    ) {
      const filteredSells = this.sells.filter(
        (sell) => new Date(sell.sellDate).toDateString() === date.toDateString()
      );
      const dailyTotal = filteredSells.reduce(
        (total, sell) => total + sell.netAmount,
        0
      );
      dailyData.push({ name: date.toLocaleDateString(), value: dailyTotal });
    }

    this.chartData = dailyData;
  }

  prepareLineChartData(): void {
    this.lineChartData = [
      {
        name: 'Two weeks sale',
        series: this.formatDataForLineChart(this.sells),
      },
    ];
  }

  formatDataForLineChart(sells: Sell[]): any[] {
    const lineChartSeries: { name: Date; value: number }[] = [];

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const filteredSells = sells.filter((sell) => {
      const sellDate = new Date(sell.sellDate);
      return sellDate >= twoWeeksAgo;
    });

    for (const sell of filteredSells) {
      const sellDate = new Date(sell.sellDate);
      const dataPoint = {
        name: sellDate,
        value: sell.netAmount,
      };
      lineChartSeries.push(dataPoint);
    }

    return lineChartSeries;
  }
}
