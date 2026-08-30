import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-bill-settings',
  templateUrl: './bill-settings.component.html',
  styleUrls: ['./bill-settings.component.scss'],
})
export class BillSettingsComponent implements OnInit {
  form: FormGroup;
  stores: any[] = [];
  branches: any[] = [];
  isSuperAdmin = false;
  message = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private branchService: BranchService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.form = this.formBuilder.group({
      storeCode: [this.auth.getStoreCode() || '', Validators.required],
      branchCode: ['', Validators.required],
      billNumberStart: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
    });
    if (this.isSuperAdmin) {
      this.storeService
        .getAllStore()
        .subscribe((stores: any[]) => (this.stores = stores || []));
    }
    if (this.form.value.storeCode) {
      this.loadBranches();
    }
  }

  onStoreChange(): void {
    this.form.patchValue({ branchCode: '', billNumberStart: '' });
    this.branches = [];
    this.loadBranches();
  }

  onBranchChange(): void {
    this.message = '';
    this.errorMessage = '';
    const branch = this.branches.find(
      item => item.branchCode === this.form.value.branchCode
    );
    this.form.patchValue({ billNumberStart: branch?.billNumberStart ?? 1111 });
  }

  save(): void {
    this.message = '';
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { branchCode, billNumberStart } = this.form.value;
    this.branchService
      .updateBillNumberStart(branchCode, Number(billNumberStart))
      .subscribe({
        next: () => (this.message = 'Bill number setting saved'),
        error: error =>
          (this.errorMessage =
            error?.error?.message || 'Unable to save bill number setting'),
      });
  }

  private loadBranches(): void {
    const storeCode = this.form.value.storeCode;
    if (!storeCode) {
      return;
    }
    this.branchService
      .getAllBranch(storeCode)
      .subscribe((branches: any[]) => (this.branches = branches || []));
  }
}
