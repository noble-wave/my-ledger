import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnInventoryComponent } from './warn-inventory.component';

describe('WarnInventoryComponent', () => {
  let component: WarnInventoryComponent;
  let fixture: ComponentFixture<WarnInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarnInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarnInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
