import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';

@Component({
  selector: 'app-inventory-item-dialog',
  templateUrl: './inventory-item-dialog.component.html',
  styleUrls: ['./inventory-item-dialog.component.scss']
})
export class InventoryItemDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  units = ['Kg', 'Gram', 'Liter', 'Piece', 'Box', 'Roll'];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private svc: InventoryItemService,
    public dialogRef: MatDialogRef<InventoryItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      _id: [''],
      itemName: ['', Validators.required],
      itemCode: ['', Validators.required],
      unit: ['', Validators.required],
      description: [''],
      minimumStockLevel: [0, [Validators.required, Validators.min(0)]],
    });

    if (this.data?.itemDetails) {
      this.isEditMode = true;
      this.load();
    }
  }

  load() {
    this.loading = true;
    const data = this.data.itemDetails;
    this.form.patchValue(data);
    this.loading = false;   
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    if (!payload._id) {
      delete payload._id; // Remove _id if it's not present to avoid sending it in the payload
    }
    const obs = this.data?.itemDetails ? this.svc.create(payload) : this.svc.create(payload);
    obs.subscribe(
      (result) => {
        this.loading = false;
        this.dialogRef.close(result);
      },
      () => (this.loading = false)
    );
  }

  close() {
    this.dialogRef.close();
  }
}
