import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInventoryComponent } from './info-inventory.component';

describe('InfoInventoryComponent', () => {
  let component: InfoInventoryComponent;
  let fixture: ComponentFixture<InfoInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
