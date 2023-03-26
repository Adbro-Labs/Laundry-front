import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCountComponent } from './service-count.component';

describe('ServiceCountComponent', () => {
  let component: ServiceCountComponent;
  let fixture: ComponentFixture<ServiceCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
