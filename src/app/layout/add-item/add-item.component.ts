import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemService } from 'src/app/shared/services/item.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  customerForm: FormGroup;
  constructor(private fb: FormBuilder, private item: ItemService,
    private popup: MatDialogRef<AddItemComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { 
      
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
      itemName: ['', Validators.required],
      itemNameArabic: ['', Validators.required],
      washingCharge: ['', Validators.required],
      dryCleanCharge: ['', [Validators.required]],
      pressingCharge: ['', [Validators.required]],
      expressWashingCharge: ['', Validators.required],
      expressDryCleanCharge: ['', [Validators.required]],
      expressPressingCharge: ['', [Validators.required]]
    });
  }
  saveCustomer() {
    if (this.customerForm.valid) {
      const customerDetails = this.customerForm.value;
      if(!customerDetails._id) {
        delete customerDetails._id;
      }
      this.item.saveItem(customerDetails).subscribe(data => {
        this.popup.close(data);
      });
    }
  }
  closePopup() {
    this.popup.close();
  }
}
