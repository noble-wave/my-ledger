import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SellService } from '../services/sell.service';
import { Sell } from '@app/models/sell.model';
import {} from '@swimlane/ngx-charts';

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
  lineChartData = [
    {
      name: 'Liechtenstein',
      series: [
        {
          value: 5267,
          name: '2016-09-17T07:39:21.007Z',
        },
        {
          value: 3171,
          name: '2016-09-13T05:24:12.981Z',
        },
        {
          value: 5227,
          name: '2016-09-13T13:28:24.939Z',
        },
        {
          value: 3698,
          name: '2016-09-17T12:07:12.357Z',
        },
        {
          value: 3219,
          name: '2016-09-14T10:26:50.654Z',
        },
      ],
    },
  ];
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
  // this is vairable for show data for date Range
  datePicker: FormGroup;
  panelOpenState = false;
  selectedDateRange: string = 'allYears'; // Default to "All Years"

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.sellService.getAll().subscribe((sells: Sell[]) => {
      this.sells = sells;
      this.prepareYearlyChartData(); // Initial chart data (yearly)

      // Delay the adjustment to give the page time to fully load
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
      this.chartView = [parentWidth, 400]; // Adjust the height as needed
    }
  }

  prepareYearlyChartData(): void {
    // Initialize an object to store yearly aggregates
    const yearlyData: { [year: string]: number } = {};

    // Loop through 'sells' and aggregate data by year
    for (const sell of this.sells) {
      const sellDate = new Date(sell.sellDate);
      const year = sellDate.getFullYear().toString();

      // Check if the year exists in the yearlyData object; if not, initialize it to 0
      if (!yearlyData[year]) {
        yearlyData[year] = 0;
      }

      // Add the netAmount to the corresponding year
      yearlyData[year] += sell.netAmount;
    }

    // Convert the aggregated data into an array suitable for the chart
    this.chartData = Object.keys(yearlyData).map((year) => ({
      name: year,
      value: yearlyData[year],
    }));
  }

  myFilter = (d: Date | null): boolean => {
    const currentYear = new Date().getFullYear();
    const year = d ? d.getFullYear() : 0;
    return year >= currentYear;
  };

  onDateRangeChange() {
    switch (this.selectedDateRange) {
      case 'allYears':
        this.prepareYearlyChartData();
        break;
      case 'last6Year':
        this.prepareLast6YearsChartData();
        break;
      case 'last6Months': 
        this.prepareLast6MonthsChartData();
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
      // When the "Save" button is clicked, update the chart based on the selected date range
      this.prepareChartData(); // Call prepareChartData to filter and format data
    }
  }

  prepareChartData(): void {
    const startDate = this.datePicker.get('start')?.value;
    const endDate = this.datePicker.get('end')?.value;

    // Filter 'sells' data based on the selected date range
    const filteredSells = this.sells.filter((sell) => {
      const sellDate = new Date(sell.sellDate);
      return sellDate >= startDate && sellDate <= endDate;
    });

    // Now, prepare your chartData based on the filtered data
    this.chartData = this.prepareChartDataFromSells(filteredSells);
  }

  prepareChartDataFromSells(filteredSells: Sell[]): any[] {
    // Create a dictionary to store daily totals
    const dailyTotals: { [key: string]: number } = {};

    // Loop through 'filteredSells' and aggregate net amounts by day
    for (const sell of filteredSells) {
      // Ensure that 'sell.sellDate' is a Date object
      const sellDate = new Date(sell.sellDate);

      if (!isNaN(sellDate.getTime())) {
        const netAmount = sell.netAmount;

        // Use the date as the key (format it to ensure uniqueness)
        const formattedDate = sellDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        const existingTotal = dailyTotals[formattedDate] || 0;

        // Add the netAmount to the existing total
        dailyTotals[formattedDate] = existingTotal + netAmount;
      }
    }

    // Convert the aggregated data into the desired format for the chart
    const formattedData: any[] = [];

    // Loop through the daily totals and format for the chart
    for (const date in dailyTotals) {
      if (dailyTotals.hasOwnProperty(date)) {
        formattedData.push({
          name: date, // X-axis label
          value: dailyTotals[date], // Y-axis value (aggregated netAmount)
        });
      }
    }

    return formattedData;
  }

  prepareLast6YearsChartData(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    // Initialize an array to store yearly aggregates for the last 6 years
    const yearlyData: any[] = [];
  
    // Loop through the last 6 years and calculate the difference
    for (let i = 0; i < 6; i++) {
      const targetYear = currentYear - i;
  
      // Filter the 'sells' data for the specific year
      const filteredSells = this.sells.filter((sell) => {
        const sellDate = new Date(sell.sellDate);
        return sellDate.getFullYear() === targetYear;
      });
  
      // Calculate the total netAmount for the year
      const yearlyTotal = filteredSells.reduce((total, sell) => total + sell.netAmount, 0);
  
      // Add the data to the yearlyData array
      yearlyData.push({
        name: targetYear.toString(),
        value: yearlyTotal,
      });
    }
  
    // Reverse the array to display the most recent year first
    this.chartData = yearlyData.reverse();
  }
  

  prepareLast6MonthsChartData(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    // Initialize an array to store monthly aggregates for the last 6 months
    const monthlyData: any[] = [];
  
    // Loop through the last 6 months and calculate the difference
    for (let i = 0; i < 6; i++) {
      let targetYear = currentYear;
      let targetMonth = currentMonth - i;
  
      if (targetMonth < 0) {
        targetYear--; // Adjust the year if necessary
        targetMonth = 12 + targetMonth;
      }
  
      const targetDate = new Date(targetYear, targetMonth, 1);
  
      // Filter the 'sells' data for the specific month and year
      const filteredSells = this.sells.filter((sell) => {
        const sellDate = new Date(sell.sellDate);
        return (
          sellDate.getFullYear() === targetYear &&
          sellDate.getMonth() === targetMonth
        );
      });
  
      // Calculate the total netAmount for the month
      const monthlyTotal = filteredSells.reduce((total, sell) => total + sell.netAmount, 0);
  
      // Add the data to the monthlyData array
      monthlyData.push({
        name: targetDate.toLocaleString('default', { month: 'long' }) + ' ' + targetYear,
        value: monthlyTotal,
      });
    }
  
    // Reverse the array to display the most recent month first
    this.chartData = monthlyData.reverse();
  }
  

}