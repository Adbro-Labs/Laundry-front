import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ItemService } from 'src/app/shared/services/item.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  customerForm: FormGroup;
  categories = [];
  constructor(
    private fb: FormBuilder,
    private item: ItemService,
    private category: CategoryService,
    private popup: MatDialogRef<AddItemComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.customerForm.patchValue(this.data);
      if (this.data.customerId) {
        this.customerForm.get('itemName').disable();
      }
    }
    this.getActiveCategories();
  }
  initForm() {
    this.customerForm = this.fb.group({
      _id: [''],
      customerId: [null],
      itemName: ['', Validators.required],
      washingCharge: ['', Validators.required],
      dryCleanCharge: ['', [Validators.required]],
      pressingCharge: ['', [Validators.required]],
      expressWashingCharge: ['', Validators.required],
      expressDryCleanCharge: ['', [Validators.required]],
      expressPressingCharge: ['', [Validators.required]],
      categories: [[]],
      sortOrder: [null],
    });
  }
  saveCustomer() {
    if (this.customerForm.valid) {
      const customerDetails = this.customerForm.value;
      if (!customerDetails._id) {
        delete customerDetails._id;
      }
      this.item.saveItem(customerDetails, customerDetails.customerId).subscribe((data) => {
        this.popup.close(data);
      });
    }
  }
  closePopup() {
    this.popup.close();
  }
  getActiveCategories() {
    this.category.getActiveCategories().subscribe((data) => {
      this.categories = data;
    });
  }
}
