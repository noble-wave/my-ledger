import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWalletPaymentComponent } from './customer-wallet-payment.component';

describe('CustomerWalletPaymentComponent', () => {
  let component: CustomerWalletPaymentComponent;
  let fixture: ComponentFixture<CustomerWalletPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWalletPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerWalletPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
