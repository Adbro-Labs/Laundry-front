import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMeasureComponent } from './top-measure.component';

describe('TopMeasureComponent', () => {
  let component: TopMeasureComponent;
  let fixture: ComponentFixture<TopMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
