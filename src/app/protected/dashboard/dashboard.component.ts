import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  products: { name: string; count: number }[];

  constructor() {
    this.products = [
      { name: 'Product 1', count: 15 },
      { name: 'Product 2', count: 5 },
      { name: 'Product 3', count: 25 },
      { name: 'Product A', count: 8 },
      { name: 'Product B', count: 15 },
      { name: 'Product C', count: 5 },
      { name: 'Product D', count: 12 },
      { name: 'Product E', count: 3 },
      { name: 'Product F', count: 18 },
      { name: 'Product G', count: 7 },
      { name: 'Product H', count: 25 },
      { name: 'Product I', count: 9 },
      { name: 'Product J', count: 16 },
    ];
  }
  ngOnInit(): void {}


}
