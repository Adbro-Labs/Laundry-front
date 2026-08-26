import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseInvoiceService } from 'src/app/shared/services/purchase-invoice.service';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-purchase-invoice-view-dialog',
  templateUrl: './purchase-invoice-view-dialog.component.html',
  styleUrls: ['./purchase-invoice-view-dialog.component.scss'],
})
export class PurchaseInvoiceViewDialogComponent implements OnInit {
  invoice: any;
  allItems = [];
  allSuppliers = [];
  loading = true;

  constructor(
    private svc: PurchaseInvoiceService,
    private itemSvc: InventoryItemService,
    private supplierSvc: SupplierService,
    public dialogRef: MatDialogRef<PurchaseInvoiceViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  ngOnInit(): void {
    this.itemSvc.getList().subscribe((res: any) => {
      this.allItems = res.data || res;
    });
    this.supplierSvc.getList().subscribe((res: any) => {
      this.allSuppliers = res.data || res;
    });
    this.svc.getById(this.data.id).subscribe(
      (res: any) => {
        this.invoice = res.data || res;
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
      ''
    );
  }

  getSupplierName(): string {
    if (this.invoice?.supplier?.supplierName) {
      return this.invoice.supplier.supplierName;
    }

    if (this.invoice?.supplierId?.supplierName) {
      return this.invoice.supplierId.supplierName;
    }

    return (
      this.allSuppliers.find(
        (supplier: any) => supplier._id === this.invoice?.supplierId
      )?.supplierName || ''
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
