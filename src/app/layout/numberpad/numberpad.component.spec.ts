import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberpadComponent } from './numberpad.component';

describe('NumberpadComponent', () => {
  let component: NumberpadComponent;
  let fixture: ComponentFixture<NumberpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
