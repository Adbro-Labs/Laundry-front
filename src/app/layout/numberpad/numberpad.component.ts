import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-numberpad',
  templateUrl: './numberpad.component.html',
  styleUrls: ['./numberpad.component.scss'],
})
export class NumberpadComponent implements OnInit {
  quantity = 0;
  constructor(
    private dialogref: MatDialogRef<NumberpadComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public existingQuantity
  ) {
    if (existingQuantity > 0) {
      this.quantity = Number(existingQuantity);
    }
  }

  ngOnInit(): void {}
  updateQuantity(value) {
    if (typeof value == 'number') {
      this.quantity = Number(
        (this.quantity?.toString() ? this.quantity?.toString() : '') + value.toString()
      );
    }
    if (typeof value == 'string') {
      switch (value) {
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
    this.dialogref.close(this.quantity);
  }
}
