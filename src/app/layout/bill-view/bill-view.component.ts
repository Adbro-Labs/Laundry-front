import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit {
  index = 0;
  isDataLoading;
  blockNext;
  @Output() updateIndex = new EventEmitter();
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data, private auth: AuthService,
  private orderApi: OrderapiService, private dialog: MatDialogRef<BillViewComponent>) { 
  }

  ngOnInit(): void {
  }

  updateItemIndex(value) {
    if (this.data) {
      const index = this.index + value;
      const branchCode = this.auth.decodeJwt()?.branchCode;
      if (branchCode) {
          this.isDataLoading = true;
          this.orderApi
              .getOrderDetailsByCustomer(this.data?.orderMaster?.[0]?.customer?._id, index)
              .subscribe((data: any) => {
                this.isDataLoading = false;
                this.data = data;
                this.index = index;
                if (this.data.branchDetails) {
                  this.blockNext = false;
                } else {
                  this.blockNext = true;
                }
              });
      }
    }
  }

  closepopup() {
    this.dialog.close();
  }
}
