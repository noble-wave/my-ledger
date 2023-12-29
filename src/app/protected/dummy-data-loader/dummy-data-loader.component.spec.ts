import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyDataLoaderComponent } from './dummy-data-loader.component';

describe('DummyDataLoaderComponent', () => {
  let component: DummyDataLoaderComponent;
  let fixture: ComponentFixture<DummyDataLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummyDataLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyDataLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
