import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemService } from 'src/app/shared/services/item.service';
import { BranchService } from 'src/app/shared/services/measure.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {
  customerForm: FormGroup;
  errormessage = "";
  constructor(private fb: FormBuilder, private item: BranchService,
    private popup: MatDialogRef<AddBranchComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { 
      
    }

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.customerForm.patchValue(this.data);
    }
  }
  initForm() {
    this.customerForm = this.fb.group({
      _id: [''],
      branchName: [''],
      branchCode: [null],
      title: ['', Validators.required],
      subtitle1: ['', Validators.required],
      subtitle2: ['', [Validators.required]],
      accessCode: ['', Validators.required]
    });
  }
  saveCustomer() {
    this.errormessage = "";
    if (this.customerForm.valid) {
      const customerDetails = this.customerForm.value;
      if(!customerDetails._id || customerDetails.customerId) {
        delete customerDetails._id;
      }
      this.item.saveBranch(customerDetails).subscribe(data => {
        this.popup.close(data);
      }, error => {
        this.errormessage = error?.error?.message;
      });
    }
  }
  closePopup() {
    this.popup.close();
  }
}
