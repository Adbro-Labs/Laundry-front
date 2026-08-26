import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-invoice-settle-dialog',
  templateUrl: './purchase-invoice-settle-dialog.component.html',
  styleUrls: ['./purchase-invoice-settle-dialog.component.scss'],
})
export class PurchaseInvoiceSettleDialogComponent {
  payingAmount: FormControl;
  paymentMethod: FormControl;
  referenceNumber: FormControl;
  totalAmount: number;
  supplierName: string;

  constructor(
    public dialogRef: MatDialogRef<PurchaseInvoiceSettleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoices: any[] }
  ) {
    const supplier = this.data.invoices[0]?.supplier;
    this.supplierName =
      supplier?.supplierName ||
      this.data.invoices[0]?.supplierId?.supplierName ||
      this.data.invoices[0]?.supplierId ||
      '';
    this.totalAmount = this.data.invoices.reduce(
      (total, invoice) => total + Number(invoice.grandTotal || 0),
      0
    );
    this.payingAmount = new FormControl(this.totalAmount, [
      Validators.required,
      Validators.min(this.totalAmount),
      Validators.max(this.totalAmount),
    ]);
    this.paymentMethod = new FormControl('', Validators.required);
    this.referenceNumber = new FormControl('');
  }

  settle(): void {
    if (this.payingAmount.invalid || this.paymentMethod.invalid) return;
    this.dialogRef.close({
      payingAmount: this.payingAmount.value,
      paymentMethod: this.paymentMethod.value,
      referenceNumber: this.referenceNumber.value,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
