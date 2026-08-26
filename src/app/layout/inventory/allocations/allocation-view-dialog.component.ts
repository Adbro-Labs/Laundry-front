import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockAllocationService } from 'src/app/shared/services/stock-allocation.service';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';

@Component({
  selector: 'app-allocation-view-dialog',
  templateUrl: './allocation-view-dialog.component.html',
  styleUrls: ['./allocation-view-dialog.component.scss'],
})
export class AllocationViewDialogComponent implements OnInit {
  allocation: any;
  allItems = [];
  loading = true;

  constructor(
    private allocationService: StockAllocationService,
    private itemService: InventoryItemService,
    public dialogRef: MatDialogRef<AllocationViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    this.itemService.getList().subscribe((res: any) => {
      this.allItems = res.data || res || [];
    });
    this.allocationService.getById(this.data.id).subscribe(
      (res: any) => {
        this.allocation = res.data || res;
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  getItemName(item: any): string {
    return (
      item.itemName ||
      item.item?.itemName ||
      item.itemId?.itemName ||
      this.allItems.find(
        (inventoryItem: any) => inventoryItem._id === item.itemId
      )?.itemName ||
      item.itemId ||
      ''
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
