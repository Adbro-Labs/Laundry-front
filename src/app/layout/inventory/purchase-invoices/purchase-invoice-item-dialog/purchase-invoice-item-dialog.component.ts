import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-invoice-item-dialog',
  templateUrl: './purchase-invoice-item-dialog.component.html',
  styleUrls: ['./purchase-invoice-item-dialog.component.scss'],
})
export class PurchaseInvoiceItemDialogComponent implements OnInit {
  form: FormGroup;
  allItems = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchaseInvoiceItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.allItems = data.allItems || [];
    this.isEditMode = !!data.item;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      itemId: [this.data.item?.itemId || '', Validators.required],
      quantity: [
        this.isEditMode ? this.data.item.quantity : '',
        [Validators.required, Validators.min(1)],
      ],
      unitCost: [
        this.isEditMode ? this.data.item.unitCost : '',
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
