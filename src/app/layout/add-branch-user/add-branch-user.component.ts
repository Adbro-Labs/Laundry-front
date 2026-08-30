import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-add-branch-user',
  templateUrl: './add-branch-user.component.html',
  styleUrls: ['./add-branch-user.component.scss'],
})
export class AddBranchUserComponent implements OnInit {
  userForm: FormGroup;
  errorMessage = '';
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private dialogRef: MatDialogRef<AddBranchUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data?.user?._id;
    this.userForm = this.formBuilder.group({
      _id: [''],
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      active: [true],
    });
    if (this.isEditing) {
      this.userForm.patchValue(this.data.user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  saveUser() {
    this.errorMessage = '';
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = { ...this.userForm.value };
    if (!user._id) {
      delete user._id;
    }
    if (this.isEditing && !user.password) {
      delete user.password;
    }
    this.auth.saveBranchUser(this.data.branchCode, user).subscribe({
      next: saved => this.dialogRef.close(saved),
      error: error =>
        (this.errorMessage = error?.error?.message || 'Unable to save user'),
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
