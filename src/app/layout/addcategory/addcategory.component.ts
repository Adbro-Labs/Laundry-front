import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.scss']
})
export class AddcategoryComponent implements OnInit {

  categoryForm: FormGroup;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private category: CategoryService,
    private popup: MatDialogRef<AddcategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.errorMessage = "";
    this.initForm();
    if (this.data) {
      this.categoryForm.patchValue(this.data);
    }
  }

  initForm() {
    this.categoryForm = this.fb.group({
      _id: [''],
      categoryName: ['', Validators.required],
      isActive: [false, Validators.required]
    });
  }

  saveCategory() {
    this.errorMessage = "";
    if (this.categoryForm.valid) {
      const categoryDetails = this.categoryForm.value;
      console.log(categoryDetails,"catttegorrrry")
      if(!categoryDetails._id) {
        delete categoryDetails._id;
      }
    
      this.category.saveCategory(categoryDetails).subscribe(data => {
        this.popup.close(data);
      }, error => {
        console.log(error);
        if (error.status && error.status === 400) {
          this.errorMessage = error.error.message;
        }
      });
    }
  }

  closePopup() {
    this.popup.close();
  }
}

