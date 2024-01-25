import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDueAmountComponent } from './customer-due-amount.component';

describe('CustomerDueAmountComponent', () => {
  let component: CustomerDueAmountComponent;
  let fixture: ComponentFixture<CustomerDueAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDueAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDueAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
