import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-corporate-trn',
  templateUrl: './corporate-trn.component.html',
})
export class CorporateTrnComponent {
  trnForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CorporateTrnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.trnForm = this.fb.group({
      trn: [data?.trn || '', [Validators.required, Validators.maxLength(30)]],
    });
  }

  confirm() {
    if (this.trnForm.valid) {
      this.dialogRef.close(this.trnForm.value.trn.trim());
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
