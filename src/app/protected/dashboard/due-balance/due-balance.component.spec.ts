import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueBalanceComponent } from './due-balance.component';

describe('DueBalanceComponent', () => {
  let component: DueBalanceComponent;
  let fixture: ComponentFixture<DueBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DueBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
