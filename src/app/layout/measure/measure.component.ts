import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MeasureService } from 'src/app/shared/services/measure.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { BottomMeasureComponent } from '../bottom-measure/bottom-measure.component';
import { TopMeasureComponent } from '../top-measure/top-measure.component';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit {

  measures = [
    'Shirt', 'Trouser'
  ];
  measureList = [];
  customerId;
  constructor(private dialog: MatDialog, private order: OrderService, private measure: MeasureService) { }

  ngOnInit(): void {
    this.order.customerIdAgent.subscribe(customerId => {
      if(customerId) {
        this.customerId = customerId;
        this.getMeasureByCustomerId(customerId);
      }
    });
  }
  addItem = (item) => {
    this.measures.push(item);
  }
  openMeasure(type) {
    if (type == "SHIRT") {
      this.dialog.open(TopMeasureComponent, {disableClose: true, width: '900px', data: {
        customerId: this.customerId
      }});
    }
    if (type == "TROUSER") {
      this.dialog.open(BottomMeasureComponent, {disableClose: true, width: '900px', data: {
        customerId: this.customerId
      }});
    }
  }
  getMeasureByCustomerId(customerId) {
    this.measure.getMeasureListByCustomer(customerId).subscribe(data => {
      this.measureList = data as any;
    });
  }
  setMeasureId(itemId) {
    this.order.addItem(itemId);
  }
}
