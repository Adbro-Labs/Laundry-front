import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockAllocationService } from 'src/app/shared/services/stock-allocation.service';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { BranchService } from 'src/app/shared/services/measure.service';

@Component({
  selector: 'app-allocation-month-view-dialog',
  templateUrl: './allocation-month-view-dialog.component.html',
  styleUrls: ['./allocation-month-view-dialog.component.scss'],
})
export class AllocationMonthViewDialogComponent implements OnInit {
  branches = [];
  allocations = [];
  allItems = [];
  rows: Array<{ itemName: string; totalAllocated: number }> = [];
  loading = true;
  years: number[] = [];
  months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];
  branchControl = new FormControl('', Validators.required);
  yearControl = new FormControl(new Date().getFullYear(), Validators.required);
  monthControl = new FormControl(new Date().getMonth(), Validators.required);

  constructor(
    private allocationService: StockAllocationService,
    private itemService: InventoryItemService,
    private branchService: BranchService,
    public dialogRef: MatDialogRef<AllocationMonthViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 1, currentYear, currentYear + 1];
  }

  ngOnInit(): void {
    this.branchService.getAllBranch().subscribe((res: any) => {
      this.branches = res.data || res || [];
    });
    this.branchControl.valueChanges.subscribe(() => this.refreshRows());
    this.yearControl.valueChanges.subscribe(() => this.refreshRows());
    this.monthControl.valueChanges.subscribe(() => this.refreshRows());

    this.itemService.getList().subscribe(
      (res: any) => {
        this.allItems = res.data || res || [];
        this.loadAllocations();
      },
      () => (this.loading = false)
    );
  }

  loadAllocations(): void {
    this.allocationService.getList().subscribe(
      (res: any) => {
        this.allocations = res.data || res || [];
        this.loading = false;
        this.refreshRows();
      },
      () => (this.loading = false)
    );
  }

  refreshRows(): void {
    if (this.branchControl.invalid || this.loading) {
      this.rows = [];
      return;
    }

    const totals = new Map<string, number>();
    this.allocations
      .filter((allocation: any) => {
        const date = new Date(allocation.allocationDate);
        const branchId = allocation.branchId?._id || allocation.branchId;
        return (
          String(branchId) === String(this.branchControl.value) &&
          date.getFullYear() === Number(this.yearControl.value) &&
          date.getMonth() === Number(this.monthControl.value)
        );
      })
      .forEach((allocation: any) => {
        (allocation.items || []).forEach((item: any) => {
          const itemId = item.itemId?._id || item.itemId;
          const name =
            item.itemName ||
            item.item?.itemName ||
            this.allItems.find(
              (inventoryItem: any) =>
                String(inventoryItem._id) === String(itemId)
            )?.itemName ||
            String(itemId);
          totals.set(
            name,
            (totals.get(name) || 0) + Number(item.quantity || 0)
          );
        });
      });

    this.rows = Array.from(totals.entries())
      .map(([itemName, totalAllocated]) => ({ itemName, totalAllocated }))
      .sort((first, second) => first.itemName.localeCompare(second.itemName));
  }

  close(): void {
    this.dialogRef.close();
  }
}
