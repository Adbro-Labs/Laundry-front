import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bill-history-dialog',
  template: `
    <h3 mat-dialog-title>Bill Details ({{ currentIndex + 1 }} / {{ data.bills.length }})</h3>
    <mat-dialog-content>
      <div class="bill-detail">
        <div class="field">
          <span class="label">Branch Name</span>
          <span class="value">{{ data.findBranch(data.bills[currentIndex]?.branchCode) }}</span>
        </div>
        <div class="field">
          <span class="label">Bill No</span>
          <span class="value">{{ data.bills[currentIndex]?.orderNumber }}</span>
        </div>
        <div class="field">
          <span class="label">Bill Total</span>
          <span class="value">{{ data.bills[currentIndex]?.total }}</span>
        </div>
        <div class="field">
          <span class="label">Discount</span>
          <span class="value">{{ data.bills[currentIndex]?.discount }}</span>
        </div>
        <div class="field">
          <span class="label">VAT</span>
          <span class="value">{{ data.bills[currentIndex]?.vatAmount }}</span>
        </div>
        <div class="field">
          <span class="label">Net Total</span>
          <span class="value">{{ data.bills[currentIndex]?.netTotal }}</span>
        </div>
        <div class="field">
          <span class="label">Status</span>
          <span class="value">{{ data.bills[currentIndex]?.status }}</span>
        </div>
        <div class="field">
          <span class="label">Remarks</span>
          <span class="value">{{ data.bills[currentIndex]?.remarks }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button [disabled]="currentIndex === 0" (click)="previous()">
        <mat-icon>chevron_left</mat-icon> Previous
      </button>
      <button mat-stroked-button [disabled]="currentIndex === data.bills.length - 1" (click)="next()">
        Next <mat-icon>chevron_right</mat-icon>
      </button>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .bill-detail {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 320px;
      }
      .field {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        padding-bottom: 6px;
      }
      .label {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
      }
      .value {
        font-weight: 600;
      }
      button mat-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
      }
    `,
  ],
})
export class BillHistoryDialogComponent {
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<BillHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bills: any[]; startIndex: number; findBranch: (code: string) => string }
  ) {
    this.currentIndex = 0;
    console.log('Received bills:', data.bills);
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.data.bills.length - 1) {
      this.currentIndex++;
    }
  }
}
