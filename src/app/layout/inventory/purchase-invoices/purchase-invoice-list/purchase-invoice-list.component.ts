import { Component, OnInit } from '@angular/core';
import { PurchaseInvoiceService } from 'src/app/shared/services/purchase-invoice.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { PurchaseInvoiceViewDialogComponent } from '../purchase-invoice-view-dialog.component';
import { PurchaseInvoiceSettleDialogComponent } from '../purchase-invoice-settle-dialog.component';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-purchase-invoice-list',
  templateUrl: './purchase-invoice-list.component.html',
  styleUrls: ['./purchase-invoice-list.component.scss'],
})
export class PurchaseInvoiceListComponent implements OnInit {
  invoices = [];
  paginatedInvoices = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalInvoices = 0;
  Math = Math;
  searchControl = new FormControl('');
  searchTerm = '';
  selectedInvoices = new Map<string, any>();
  private destroy$ = new Subject<void>();

  constructor(
    private svc: PurchaseInvoiceService,
    private router: Router,
    private dialog: MatDialog,
    private paymentSvc: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((search: string) => {
          this.searchTerm = (search || '').trim();
          this.currentPage = 1;
          return this.svc.getList(this.searchTerm, this.currentPage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => this.applyInvoiceResponse(res));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInvoices(page = this.currentPage): void {
    this.svc.getList(this.searchTerm, page).subscribe((res: any) => {
      this.applyInvoiceResponse(res);
    });
  }

  applyInvoiceResponse(res: any): void {
    const data = res.data || res;
    this.invoices = Array.isArray(data) ? data : data.items || [];
    const selected = Array.from(this.selectedInvoices.values());
    const selectedIds = new Set(selected.map(invoice => invoice._id));
    this.paginatedInvoices = [
      ...selected,
      ...this.invoices.filter(invoice => !selectedIds.has(invoice._id)),
    ];
    this.currentPage = res.currentPage || res.page || this.currentPage;
    this.pageSize = res.pageSize || this.pageSize;
    this.totalInvoices = res.total ?? this.invoices.length;
    this.totalPages =
      res.totalPages || Math.ceil(this.invoices.length / this.pageSize);
  }

  updatePaginatedInvoices(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedInvoices = this.invoices.slice(startIndex, endIndex);
  }

  isSelected(invoiceId: string): boolean {
    return this.selectedInvoices.has(invoiceId);
  }

  toggleSelection(invoice: any, selected: boolean): void {
    if (selected) {
      this.selectedInvoices.set(invoice._id, invoice);
    } else {
      this.selectedInvoices.delete(invoice._id);
    }
    this.applySelectedInvoices();
  }

  settleSelected(): void {
    const selected = Array.from(this.selectedInvoices.values());
    if (!selected.length) return;

    if (selected.some(invoice => invoice.status !== 'Pending')) {
      this.snackBar.open('Only pending invoices can be settled', 'OK', {
        duration: 2000,
      });
      return;
    }

    const supplierIds = new Set(
      selected.map(invoice =>
        String(invoice.supplierId?._id || invoice.supplierId)
      )
    );
    if (supplierIds.size !== 1) {
      this.snackBar.open(
        'Invoices from only one supplier can be settled at a time',
        'OK',
        { duration: 2000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(PurchaseInvoiceSettleDialogComponent, {
      width: '500px',
      data: { invoices: selected },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.paymentSvc
        .settleInvoices(
          selected.map(invoice => invoice._id),
          result.payingAmount,
          result.paymentMethod,
          result.referenceNumber,
          result.chequeDate
        )
        .subscribe(
          () => {
            this.selectedInvoices.clear();
            this.snackBar.open('Invoice(s) settled successfully', 'OK', {
              duration: 2000,
            });
            this.loadInvoices();
          },
          () => {
            this.snackBar.open(
              'Something went wrong. Please try again.',
              'OK',
              {
                duration: 2000,
              }
            );
          }
        );
    });
  }

  private applySelectedInvoices(): void {
    const selected = Array.from(this.selectedInvoices.values());
    const selectedIds = new Set(selected.map(invoice => invoice._id));
    this.paginatedInvoices = [
      ...selected,
      ...this.invoices.filter(invoice => !selectedIds.has(invoice._id)),
    ];
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadInvoices();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadInvoices();
    }
  }

  create(): void {
    this.router.navigate(['/inventory/purchase-invoices/create']);
  }

  view(id: string): void {
    this.dialog.open(PurchaseInvoiceViewDialogComponent, {
      width: '560px',
      data: { id },
    });
  }

  edit(id: string): void {
    this.router.navigate(['/inventory/purchase-invoices/view', id]);
  }

  canEdit(invoice: any): boolean {
    if (!invoice?.createdAt) return false;

    const createdAt = new Date(invoice.createdAt).getTime();
    const age = Date.now() - createdAt;
    const fortyEightHours = 48 * 60 * 60 * 1000;

    return Number.isFinite(createdAt) && age >= 0 && age < fortyEightHours;
  }
}
