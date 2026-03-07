import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-close-bill-dialog',
  template: `
    <h3 mat-dialog-title>Close Bill</h3>
    <mat-dialog-content>
      <p>Select a status for bill <strong>{{ data?.orderNumber }}</strong>:</p>

      <mat-radio-group [(ngModel)]="selectedStatus" class="status-group">
        <mat-radio-button value="SETTLED">Approve</mat-radio-button>
        <mat-radio-button value="IN_REVIEW">In Review</mat-radio-button>
      </mat-radio-group>

      <mat-form-field appearance="outline" class="description-field">
        <mat-label>Remarks (optional)</mat-label>
        <textarea matInput [(ngModel)]="remarks" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        color="warn"
        [disabled]="!selectedStatus"
        (click)="submit()"
      >
        Close Bill
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .status-group {
        display: flex;
        gap: 24px;
        margin: 16px 0;
      }
      .description-field {
        width: 100%;
        margin-top: 8px;
      }
    `,
  ],
})
export class CloseBillDialogComponent {
  selectedStatus: string = '';
  remarks: string = '';

  constructor(
    private dialogRef: MatDialogRef<CloseBillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    this.dialogRef.close({
      status: this.selectedStatus,
      remarks: this.remarks,
    });
  }
}
