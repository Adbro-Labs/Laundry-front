import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { StockAllocationService } from 'src/app/shared/services/stock-allocation.service';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { InventoryReportService } from 'src/app/shared/services/inventory-report.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-allocations-form',
  templateUrl: './allocations-form.component.html',
  styleUrls: ['./allocations-form.component.scss'],
})
export class AllocationsFormComponent implements OnInit {
  private readonly maxQuantityDigits = 9999;
  form: FormGroup;
  allItems = [];
  branches = [];
  // map of itemId -> current stock for selected branch
  currentStockMap: { [itemId: string]: number } = {};
  // central stock map (warehouse/central inventory)
  centralStockMap: { [itemId: string]: number } = {};

  private integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value === '' || value === null || Number.isInteger(Number(value))
      ? null
      : { integer: true };
  }

  constructor(
    private fb: FormBuilder,
    private svc: StockAllocationService,
    private itemSvc: InventoryItemService,
    private branchSvc: BranchService,
    private inventoryReport: InventoryReportService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<AllocationsFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      branchId: ['', Validators.required],
      allocationDate: [new Date()],
      remarks: [''],
      items: this.fb.array([]),
    });

    // load items and branches
    this.itemSvc
      .getList()
      .subscribe((res: any) => (this.allItems = res.data || res || []));
    this.branchSvc
      .getAllBranch()
      .subscribe((res: any) => (this.branches = res.data || res || []));

    // load central stock once
    this.inventoryReport.getCentralStockReport().subscribe((resp: any) => {
      const list = resp.data || resp || [];
      list.forEach((r: any) => {
        const id = r.item && r.item._id ? r.item._id : r.item || r.itemId;
        this.centralStockMap[id] = r.currentStock || 0;
      });

      this.updateQuantityValidators();
    });

    // when branch changes, load branch stock report
    this.form.get('branchId').valueChanges.subscribe(branchId => {
      this.currentStockMap = {};
      if (!branchId) {
        this.items.controls.forEach(item => item.get('itemId').reset());
        return;
      }
      if (this.items.length === 0) this.add();
      this.inventoryReport
        .getBranchStockReport(branchId)
        .subscribe((resp: any) => {
          const list = resp.data || resp || [];
          list.forEach((r: any) => {
            const id = r.item && r.item._id ? r.item._id : r.item || r.itemId;
            this.currentStockMap[id] = r.currentStock || 0;
          });
        });
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  add(): void {
    if (!this.form.get('branchId')?.value) {
      this.snack.open('Select a branch before adding products', 'OK', {
        duration: 2000,
      });
      return;
    }
    if (!this.canAddItem()) {
      this.snack.open(
        'Complete the current product before adding another',
        'OK',
        { duration: 2000 }
      );
      return;
    }

    const grp = this.fb.group({
      itemId: ['', Validators.required],
      quantity: [
        '',
        [Validators.required, this.integerValidator, Validators.min(1)],
      ],
    });
    this.items.push(grp);

    // attach item change listener to set max validator based on central stock
    this.setupItemSubscription(grp);
  }

  canAddItem(): boolean {
    return this.items.controls.every(item => {
      const itemId = item.get('itemId')?.value;
      const quantity = Number(item.get('quantity')?.value);
      return Boolean(itemId) && quantity >= 1 && item.valid;
    });
  }

  getQuantityMax(itemId: string): number {
    return Math.min(
      this.centralStockMap[itemId] ?? this.maxQuantityDigits,
      this.maxQuantityDigits
    );
  }

  getRowQuantityMax(itemId: string, rowIndex: number): number {
    const allocatedByOtherRows = this.items.controls.reduce(
      (total, row, index) => {
        if (index === rowIndex || row.get('itemId')?.value !== itemId) {
          return total;
        }
        return total + Number(row.get('quantity')?.value || 0);
      },
      0
    );

    return Math.max(0, this.getQuantityMax(itemId) - allocatedByOtherRows);
  }

  private updateQuantityValidators(): void {
    this.items.controls.forEach((row, index) => {
      const itemId = row.get('itemId')?.value;
      const quantityCtrl = row.get('quantity');
      const max = this.getRowQuantityMax(itemId, index);
      quantityCtrl.setValidators([
        Validators.required,
        this.integerValidator,
        Validators.min(1),
        Validators.max(max),
      ]);
      quantityCtrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setupItemSubscription(grp: any): void {
    const itemCtrl = grp.get('itemId');
    const qtyCtrl = grp.get('quantity');
    itemCtrl.valueChanges.subscribe(() => {
      this.updateQuantityValidators();
    });
    qtyCtrl.valueChanges.subscribe(() => this.updateQuantityValidators());
    this.updateQuantityValidators();
  }

  remove(i: number): void {
    this.items.removeAt(i);
    this.updateQuantityValidators();
  }

  cancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/inventory/allocations']);
    }
  }

  save(): void {
    if (this.form.invalid || this.items.length === 0) return;

    this.svc.create(this.form.value).subscribe(
      () => {
        this.snack.open('Allocation created', 'OK', { duration: 3000 });
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/inventory/allocations']);
        }
      },
      err => {
        console.error(err);
        this.snack.open('Failed to create allocation', 'OK', {
          duration: 4000,
        });
      }
    );
  }
}
