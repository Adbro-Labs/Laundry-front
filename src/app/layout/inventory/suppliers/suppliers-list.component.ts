import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SupplierDialogComponent } from './supplier-dialog.component';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss'],
})
export class SupplierListComponent implements OnInit {
  displayedColumns = [
    'supplierName',
    'contactPerson',
    'phone',
    'email',
    'isActive',
    'actions',
  ];
  dataSource = new MatTableDataSource([]);
  loading = false;

  constructor(
    private svc: SupplierService,
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
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  edit(data) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: { supplierDetails: data },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  view(id) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: { id, viewOnly: true },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  disable(id) {
    if (!confirm('Disable this supplier?')) return;
    this.svc.disable(id).subscribe(() => this.load());
  }
}
