import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss']
})
export class CustomerPaymentComponent {

  constructor(private location: Location){}

  ngOnInit(){}

  navigateBack() {
    this.location.back();
  }
}
