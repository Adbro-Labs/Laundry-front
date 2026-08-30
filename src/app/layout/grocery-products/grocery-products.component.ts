import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GroceryProductService } from 'src/app/shared/services/grocery-product.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-grocery-products',
  templateUrl: './grocery-products.component.html',
  styleUrls: ['./grocery-products.component.scss'],
})
export class GroceryProductsComponent implements OnInit {
  form: FormGroup;
  products: any[] = [];
  stores: any[] = [];
  selectedStoreCode = '';
  isSuperAdmin = false;
  query = '';
  message = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private groceryProducts: GroceryProductService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.selectedStoreCode = this.auth.getStoreCode() || '';
    this.form = this.formBuilder.group({
      _id: [''],
      itemName: ['', Validators.required],
      category: ['', Validators.required],
      sku: ['', Validators.required],
      barcode: [''],
      unit: ['PIECE', Validators.required],
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      minimumStockLevel: [0, [Validators.required, Validators.min(0)]],
    });
    if (this.isSuperAdmin)
      this.storeService
        .getAllStore()
        .subscribe((stores: any[]) => (this.stores = stores || []));
    this.loadProducts();
  }

  onStoreChange(): void {
    this.clearForm();
    this.loadProducts();
  }

  loadProducts(): void {
    if (!this.selectedStoreCode) {
      this.products = [];
      return;
    }
    this.groceryProducts
      .search('', this.query, '', 0, this.selectedStoreCode)
      .subscribe({
        next: response => (this.products = response.data || []),
        error: error =>
          (this.errorMessage =
            error?.error?.message || 'Unable to load products'),
      });
  }

  edit(product: any): void {
    this.message = '';
    this.errorMessage = '';
    this.form.patchValue(product);
  }

  save(): void {
    this.message = '';
    this.errorMessage = '';
    if (!this.selectedStoreCode) {
      this.errorMessage = 'Select a store before saving a product';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.groceryProducts
      .saveProduct({ ...this.form.value, storeCode: this.selectedStoreCode })
      .subscribe({
        next: () => {
          this.message = 'Product saved';
          this.clearForm();
          this.loadProducts();
        },
        error: error =>
          (this.errorMessage =
            error?.error?.message || 'Unable to save product'),
      });
  }

  clearForm(): void {
    this.form.reset({ unit: 'PIECE', minimumStockLevel: 0 });
  }
}
