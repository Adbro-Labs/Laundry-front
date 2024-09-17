import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { paymentMethod} from "../../shared/enums"
@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {

  paymentMethod = paymentMethod;
  constructor(private dialogRef: MatDialogRef<SettlementComponent>) { }

  ngOnInit(): void {
  }

  confirmSettlement(settlementType) {
    this.dialogRef.close(settlementType);
  }
}
