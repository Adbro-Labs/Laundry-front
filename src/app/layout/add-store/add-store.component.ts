import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss'],
})
export class AddStoreComponent implements OnInit {
  storeForm: FormGroup;
  errormessage = '';
  admins: any[] = [];

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private auth: AuthService,
    private popup: MatDialogRef<AddStoreComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAdmins();
    this.setupAccessCodeRules();
    if (this.data) {
      this.storeForm.patchValue(this.data);
      this.prefillLinkedAdmin();
      this.updateAccessCodeRules(this.storeForm.get('adminAuthId')?.value);
    }
  }

  initForm() {
    this.storeForm = this.fb.group({
      _id: [''],
      storeName: ['', Validators.required],
      contactName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      accessCode: [''],
      adminAuthId: [''],
      active: [true],
    });
  }

  setupAccessCodeRules() {
    this.storeForm.get('adminAuthId')?.valueChanges.subscribe((adminAuthId) => {
      this.updateAccessCodeRules(adminAuthId);
    });
    this.updateAccessCodeRules(this.storeForm.get('adminAuthId')?.value);
  }

  updateAccessCodeRules(adminAuthId) {
    const accessCodeControl = this.storeForm.get('accessCode');
    if (!accessCodeControl) {
      return;
    }

    if (adminAuthId) {
      accessCodeControl.clearValidators();
    } else {
      accessCodeControl.setValidators([Validators.required]);
    }
    accessCodeControl.updateValueAndValidity({ emitEvent: false });
  }

  loadAdmins() {
    this.auth.getAdminUsers().subscribe((data: any) => {
      this.admins = data || [];
      this.prefillLinkedAdmin();
    });
  }

  prefillLinkedAdmin() {
    if (!this.storeForm || !this.admins.length) {
      return;
    }

    const storeCode = this.data?.storeCode || this.storeForm.get('storeCode')?.value;
    if (!storeCode) {
      return;
    }

    const linkedAdmin = this.admins.find((item) => item.storeCode === storeCode);
    if (linkedAdmin) {
      this.storeForm.get('adminAuthId')?.setValue(linkedAdmin._id);
      this.updateAccessCodeRules(linkedAdmin._id);
    }
  }

  saveStore() {
    this.errormessage = '';
    if (this.storeForm.valid) {
      const storeDetails = this.storeForm.value;
      if (!storeDetails._id) {
        delete storeDetails._id;
      }
      this.store.saveStore(storeDetails).subscribe(
        (data) => {
          this.popup.close(data);
        },
        (error) => {
          this.errormessage = error?.error?.message;
        }
      );
    }
  }

  closePopup() {
    this.popup.close();
  }
}
