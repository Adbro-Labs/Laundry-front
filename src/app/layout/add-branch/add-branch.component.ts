import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss'],
})
export class AddBranchComponent implements OnInit {
  customerForm: FormGroup;
  errormessage = '';
  stores: any[] = [];
  isSuperAdmin = false;
  showStoreSelector = false;
  constructor(
    private fb: FormBuilder,
    private item: BranchService,
    private storeService: StoreService,
    private auth: AuthService,
    private popup: MatDialogRef<AddBranchComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.initForm();
    this.loadStores();
    this.initializeStoreContext();
    if (this.data) {
      this.customerForm.patchValue(this.data);
    } else {
      const storeCode = this.auth.getStoreCode();
      if (storeCode) {
        this.customerForm.get('storeCode')?.setValue(storeCode);
      }
    }
  }
  initForm() {
    this.customerForm = this.fb.group({
      _id: [''],
      branchName: [''],
      branchCode: [null],
      storeCode: [''],
      title: ['', Validators.required],
      subtitle1: ['', Validators.required],
      subtitle2: ['', [Validators.required]],
      accessCode: [''],
      imageUrl: [''],
      enableVat: [false],
      taxNumber: [''],
    });
  }
  loadStores() {
    this.storeService.getAllStore().subscribe((data: any) => {
      this.stores = data || [];
    });
  }
  findStoreName(storeCode) {
    if (!storeCode) {
      return '-';
    }
    const store = this.stores.find((item) => item.storeCode === storeCode);
    return store?.storeName || storeCode;
  }
  initializeStoreContext() {
    const storeCode = this.data?.storeCode || this.auth.getStoreCode();
    if (storeCode) {
      this.customerForm.get('storeCode')?.setValue(storeCode);
      this.showStoreSelector = false;
      return;
    }

    if (this.isSuperAdmin) {
      this.showStoreSelector = true;
      this.customerForm.get('storeCode')?.setValidators([Validators.required]);
      this.customerForm.get('storeCode')?.updateValueAndValidity();
    }
  }
  saveCustomer() {
    this.errormessage = '';
    if (this.customerForm.valid) {
      const customerDetails = this.customerForm.value;
      if (!customerDetails.storeCode) {
        this.errormessage = 'Select a store before saving';
        return;
      }
      if (!customerDetails._id || customerDetails.customerId) {
        delete customerDetails._id;
      }
      this.item.saveBranch(customerDetails).subscribe(
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
