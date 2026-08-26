import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseInvoiceService } from 'src/app/shared/services/purchase-invoice.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { InventoryItemService } from 'src/app/shared/services/inventory-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseInvoiceItemDialogComponent } from './purchase-invoice-item-dialog/purchase-invoice-item-dialog.component';

@Component({
  selector: 'app-purchase-invoice-form',
  templateUrl: './purchase-invoice-form.component.html',
  styleUrls: ['./purchase-invoice-form.component.scss'],
})
export class PurchaseInvoiceFormComponent implements OnInit {
  form: FormGroup;
  allSuppliers = [];
  allItems = [];
  id: string;
  isReadOnly = false;
  loading = false;
  displayedColumns = ['itemId', 'quantity', 'unitCost', 'totalCost', 'actions'];

  constructor(
    private fb: FormBuilder,
    private svc: PurchaseInvoiceService,
    private supSvc: SupplierService,
    private itemSvc: InventoryItemService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      supplierId: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: [new Date(), Validators.required],
      remarks: [''],
      items: this.fb.array([]),
      discount: [0],
      subtotal: [{ value: 0, disabled: true }],
      grandTotal: [{ value: 0, disabled: true }],
    });

    this.supSvc.getList().subscribe((res: any) => {
      this.allSuppliers = res.data || res;
    });
    this.itemSvc.getList().subscribe((res: any) => {
      this.allItems = res.data || res;
    });

    this.id = this.route.snapshot.params['id'];
    if (this.id) this.load();

    // Listen to discount changes
    this.form.get('discount')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  removeRow(index: number) {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  openItemDialog(index?: number) {
    const data = index !== undefined ? this.items.at(index).value : null;
    const dialogRef = this.dialog.open(PurchaseInvoiceItemDialogComponent, {
      width: '500px',
      data: {
        item: data,
        allItems: this.allItems,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index !== undefined) {
          this.items.at(index).patchValue(result);
        } else {
          this.items.push(
            this.fb.group({
              itemId: [result.itemId, Validators.required],
              quantity: [
                result.quantity,
                [Validators.required, Validators.min(1)],
              ],
              unitCost: [
                result.unitCost,
                [Validators.required, Validators.min(0.01)],
              ],
              totalCost: [{ value: 0, disabled: true }],
            })
          );
        }
        this.calculateTotals();
      }
    });
  }

  editRow(index: number) {
    this.openItemDialog(index);
  }

  getItemName(itemId: string): string {
    const item = this.allItems.find((i: any) => i._id === itemId);
    return item ? item.itemName : '';
  }

  load() {
    this.loading = true;
    this.svc.getById(this.id).subscribe(
      (res: any) => {
        const data = res.data || res;
        this.form.patchValue({
          supplierId: data.supplierId,
          invoiceNumber: data.invoiceNumber,
          invoiceDate: data.invoiceDate,
          remarks: data.remarks,
          discount: data.discount || 0,
        });
        data.items.forEach(item => {
          this.items.push(
            this.fb.group({
              itemId: [item.itemId],
              quantity: [item.quantity],
              unitCost: [item.unitCost],
              totalCost: [{ value: item.totalCost, disabled: true }],
            })
          );
        });
        this.calculateTotals();
        this.isReadOnly = !this.canEdit(data);
        if (this.isReadOnly) {
          this.form.disable();
        }
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  canEdit(invoice: any): boolean {
    if (!invoice?.createdAt) return false;

    const createdAt = new Date(invoice.createdAt).getTime();
    const age = Date.now() - createdAt;
    const fortyEightHours = 48 * 60 * 60 * 1000;

    return Number.isFinite(createdAt) && age >= 0 && age < fortyEightHours;
  }

  calculateTotals() {
    let subtotal = 0;
    this.items.controls.forEach(row => {
      const quantity = Number(row.get('quantity')?.value || 0);
      const unitCost = Number(row.get('unitCost')?.value || 0);
      const total = quantity * unitCost;
      row.get('totalCost')?.setValue(total, { emitEvent: false });
      subtotal += total;
    });
    const discount = Number(this.form.get('discount')?.value || 0);
    const grandTotal = subtotal - discount;
    this.form.get('subtotal')?.setValue(subtotal, { emitEvent: false });
    this.form.get('grandTotal')?.setValue(grandTotal, { emitEvent: false });
  }

  onQuantityOrCostChange() {
    this.calculateTotals();
  }

  save() {
    if (this.isReadOnly) {
      this.snackBar.open(
        'Invoices older than 48 hours cannot be edited',
        'OK',
        {
          duration: 2000,
        }
      );
      return;
    }
    this.calculateTotals();
    if (this.form.get('grandTotal')?.value < 0) {
      this.snackBar.open('Grand total cannot be negative', 'OK', {
        duration: 2000,
      });
      return;
    }
    if (this.form.invalid || this.items.length === 0) {
      this.snackBar.open(
        'Please fill all required fields and add at least one item',
        'OK',
        { duration: 2000 }
      );
      return;
    }
    this.loading = true;
    const payload = {
      supplierId: this.form.get('supplierId')?.value,
      invoiceNumber: this.form.get('invoiceNumber')?.value,
      invoiceDate: this.form.get('invoiceDate')?.value,
      remarks: this.form.get('remarks')?.value,
      items: this.items.getRawValue(),
      subtotal: this.form.get('subtotal')?.value,
      discount: this.form.get('discount')?.value,
      grandTotal: this.form.get('grandTotal')?.value,
    };
    const obs = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);
    obs.subscribe(
      () => {
        this.loading = false;
        this.snackBar.open(
          this.id
            ? 'Purchase invoice updated successfully'
            : 'Purchase invoice created successfully',
          'OK',
          { duration: 2000 }
        );
        this.router.navigate(['/inventory/purchase-invoices']);
      },
      error => {
        this.loading = false;
        const message =
          error?.error?.code === 'DUPLICATE_INVOICE_NUMBER'
            ? 'Invoice number already exists. Please use a different number.'
            : 'Something went wrong. Please try again.';
        this.snackBar.open(message, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  cancel() {
    this.router.navigate(['/inventory/purchase-invoices']);
  }
}
