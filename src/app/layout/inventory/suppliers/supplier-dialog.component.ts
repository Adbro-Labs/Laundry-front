import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss']
})
export class SupplierDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private svc: SupplierService,
    public dialogRef: MatDialogRef<SupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      _id: [''],
      supplierName: ['', Validators.required],
      contactPerson: [''],
      phone: [''],
      email: ['', Validators.email],
      address: [''],
      notes: [''],
    });

    if (this.data?.supplierDetails) {
      this.isEditMode = true;
      this.load();
    }
  }

  load() {
    this.loading = true;
    const data = this.data.supplierDetails;
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
    const obs = this.data?.id ? this.svc.update(this.data.id, payload) : this.svc.create(payload);
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
