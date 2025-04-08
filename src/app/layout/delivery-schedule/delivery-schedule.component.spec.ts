import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryScheduleComponent } from './delivery-schedule.component';

describe('DeliveryScheduleComponent', () => {
  let component: DeliveryScheduleComponent;
  let fixture: ComponentFixture<DeliveryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryScheduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
