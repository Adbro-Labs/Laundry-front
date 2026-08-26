import { Component, OnInit } from '@angular/core';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItemDialogComponent } from './inventory-item-dialog.component';

@Component({
  selector: 'app-inventory-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class InventoryItemsListComponent implements OnInit {
  displayedColumns = [
    'itemCode',
    'itemName',
    'unit',
    'minimumStockLevel',
    'isActive',
    'actions',
  ];
  dataSource = new MatTableDataSource([]);
  loading = false;

  constructor(
    private svc: InventoryItemService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getList().subscribe(
      (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  add() {
    const dialogRef = this.dialog.open(InventoryItemDialogComponent, {
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  edit(data) {
    const dialogRef = this.dialog.open(InventoryItemDialogComponent, {
      width: '500px',
      data: { itemDetails: data },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  view(id) {
    const dialogRef = this.dialog.open(InventoryItemDialogComponent, {
      width: '500px',
      data: { id, viewOnly: true },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  disable(id) {
    if (!confirm('Disable this item?')) return;
    this.svc.disable(id).subscribe(() => this.load());
  }
}
