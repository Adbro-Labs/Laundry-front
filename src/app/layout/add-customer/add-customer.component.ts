import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  customerForm: FormGroup;
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private customer: CustomerService,
    private popup: MatDialogRef<AddCustomerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.errorMessage = '';
    this.initForm();
    if (this.data) {
      this.customerForm.patchValue(this.data);
    }
  }
  initForm() {
    this.customerForm = this.fb.group({
      _id: [''],
      customerName: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      emailId: [''],
      cardNumber: [''],
    });
  }
  saveCustomer() {
    this.errorMessage = '';
    if (this.customerForm.valid) {
      const customerDetails = this.customerForm.value;
      if (!customerDetails._id) {
        delete customerDetails._id;
      }
      this.customer.saveCustomer(customerDetails).subscribe(
        (data) => {
          this.popup.close(data);
        },
        (error) => {
          console.log(error);
          if (error.status && error.status == 400) {
            this.errorMessage = error.error.message;
          }
        }
      );
    }
  }
  closePopup() {
    this.popup.close();
  }
}
