import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-count',
  templateUrl: './service-count.component.html',
  styleUrls: ['./service-count.component.scss']
})
export class ServiceCountComponent implements OnInit {
  quantity;
  washRequired = true;
  dryCleanRequired = false;
  pressRequired = false;
  processType = "HANGER";
  isExpressRequired = false;
  constructor(private dialogRef: MatDialogRef<ServiceCountComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  updateQuantity(value) {
    if (typeof value == "number") {
      this.quantity = Number((this.quantity?.toString() ? this.quantity?.toString() : "") + value.toString());
    }
    if (typeof value == "string") {
      switch(value) {
        case 'backspace':
          let str = this.quantity?.toString();
          if (str.length > 0) {
            str = str.substring(0, str.length - 1);
          }
          this.quantity = Number(str);
          break;
      }
    }
  }
  submitDetails() {
    if (this.washRequired) {
      this.pressRequired = false;
    }
    let atLeastOneService = this.washRequired || this.dryCleanRequired || this.pressRequired;
    if (atLeastOneService && this.quantity > 0) {
      this.dialogRef.close({
        washRequired: this.washRequired,
        dryCleanRequired: this.dryCleanRequired,
        pressRequired: this.pressRequired,
        quantity: this.quantity,
        itemDetails: this.data,
        processType: this.processType,
        expressOrder: this.isExpressRequired
      });
    }
  }
  
  updateSelection(item) {
    this.washRequired = false;
    this.dryCleanRequired = false;
    this.pressRequired = false;
    switch(item) {
      case 'washRequired':
        this.washRequired = true;
        break;
      case 'dryCleanRequired':
        this.dryCleanRequired = true;
        break;
      case 'pressRequired':
        this.pressRequired = true;
        break;
    }
  }
}
