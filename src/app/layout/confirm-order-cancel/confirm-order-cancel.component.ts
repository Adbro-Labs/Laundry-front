import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-order-cancel',
  templateUrl: './confirm-order-cancel.component.html',
  styleUrls: ['./confirm-order-cancel.component.scss']
})
export class ConfirmOrderCancelComponent implements OnInit {
  cancellationReason = "";
  showInput = false;

  constructor(private dialogRef: MatDialogRef<ConfirmOrderCancelComponent>) { }

  ngOnInit(): void {
  }

  updateReason(event) {
    const reason = event.value;
    if (reason == "other") {
      this.showInput = true;
      this.cancellationReason = "";
    } else {
      this.showInput = false;
      this.cancellationReason = reason;
    }
  }
  closeDialog() {
    this.cancellationReason = "";
    this.dialogRef.close();
  }
  confirmCancellation() {
    this.dialogRef.close(this.cancellationReason);
  }

}
