import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  constructor( private location: Location,) {}

  ngOnInit(): void {}

  navigateBack(){
    this.location.back();
  }

}
