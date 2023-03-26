import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomMeasureComponent } from './bottom-measure.component';

describe('BottomMeasureComponent', () => {
  let component: BottomMeasureComponent;
  let fixture: ComponentFixture<BottomMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
