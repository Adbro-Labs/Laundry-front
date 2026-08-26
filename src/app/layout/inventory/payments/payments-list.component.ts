import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseInvoiceViewDialogComponent } from '../purchase-invoices/purchase-invoice-view-dialog.component';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsListComponent implements OnInit {
  payments = [];
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private svc: PaymentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPayments();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((search: string) =>
          this.svc.getPaymentHistory((search || '').trim())
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        this.payments = res.data || res;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPayments(): void {
    this.svc.getPaymentHistory().subscribe((res: any) => {
      this.payments = res.data || res;
    });
  }

  viewInvoice(id: string): void {
    this.dialog.open(PurchaseInvoiceViewDialogComponent, {
      width: '560px',
      data: { id },
    });
  }
}
