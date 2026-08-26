import { Component, OnInit } from '@angular/core';
import { StockAllocationService } from 'src/app/shared/services/stock-allocation.service';
import { InventoryReportService } from 'src/app/shared/services/inventory-report.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AllocationsFormComponent } from '../allocations/allocations-form.component';
import { AllocationViewDialogComponent } from '../allocations/allocation-view-dialog.component';
import { AllocationMonthViewDialogComponent } from '../allocations/allocation-month-view-dialog.component';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-allocations-list',
  templateUrl: './allocations-list.component.html',
  styleUrls: ['./allocations-list.component.scss'],
})
export class AllocationsListComponent implements OnInit {
  allocations = [];
  filteredAllocations = [];
  paginatedAllocations = [];
  currentPage = 1;
  pageSize = 10;
  Math = Math;
  loading = false;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  // stock overview data
  stockOverview: any = {};
  centralOverview: any[] = [];
  branchOverview: any[] = [];
  // normalized summaries for easier rendering
  centralSummary: Array<{
    itemName: string;
    currentStock: number;
    allocated?: number;
  }> = [];
  branchSummaries: Array<{
    branchName: string;
    totalAllocated: number;
    totalItems?: number;
  }> = [];
  overviewLoading = false;

  constructor(
    private svc: StockAllocationService,
    private inventoryReport: InventoryReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.load();
    this.loadOverview();
    this.searchControl.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search: string) => this.filterAllocations(search || ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.loading = true;
    this.svc.getList().subscribe(
      (res: any) => {
        this.allocations = res.data || res || [];
        this.filterAllocations(this.searchControl.value || '');
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  filterAllocations(search: string): void {
    this.currentPage = 1;
    const tokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      this.filteredAllocations = this.allocations;
      this.updatePaginatedAllocations();
      return;
    }

    this.filteredAllocations = this.allocations.filter((allocation: any) => {
      const date = allocation.allocationDate
        ? new Date(allocation.allocationDate)
        : null;
      const dateText = date
        ? [
            date.toISOString(),
            date.toLocaleDateString('en-AE'),
            `${String(date.getDate()).padStart(2, '0')}/${String(
              date.getMonth() + 1
            ).padStart(2, '0')}`,
            `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
              date.getDate()
            ).padStart(2, '0')}`,
            `${date.getDate()}/${date.getMonth() + 1}`,
            `${date.getMonth() + 1}/${date.getDate()}`,
          ].join(' ')
        : '';
      const searchableText = [
        allocation.branchId?.branchName,
        allocation.remarks,
        allocation.allocationNumber,
        dateText,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return tokens.every(token => searchableText.includes(token));
    });
    this.updatePaginatedAllocations();
  }

  updatePaginatedAllocations(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedAllocations = this.filteredAllocations.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAllocations.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAllocations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAllocations();
    }
  }

  loadOverview() {
    this.overviewLoading = true;
    this.inventoryReport.getStockOverview().subscribe(
      (res: any) => {
        this.stockOverview = res.data || res || {};
        // normalize central and branches
        this.centralOverview =
          this.stockOverview.central ||
          this.stockOverview.centralStock ||
          this.stockOverview.centralOverview ||
          [];
        this.branchOverview =
          this.stockOverview.branches ||
          this.stockOverview.branchOverview ||
          this.stockOverview.branchStock ||
          [];

        // normalize central
        this.centralSummary = (this.centralOverview || []).map((c: any) => {
          const item = c.item || c.itemId || c.itemRef || {};
          const itemName =
            item.itemName ||
            item.name ||
            c.itemName ||
            (typeof item === 'string' ? item : '');
          return {
            itemName,
            currentStock: c.currentStock || c.stock || c.qty || 0,
            allocated: c.allocated || c.allocatedQty || c.allocatedCount || 0,
          };
        });

        // normalize branch summaries
        this.branchSummaries = (this.branchOverview || []).map((b: any) => {
          const branch = b.branch || b.branchId || b.branchRef || {};
          const branchName =
            branch.branchName ||
            branch.name ||
            b.branchName ||
            (typeof branch === 'string' ? branch : '');
          // try to get totalAllocated
          let totalAllocated =
            b.totalAllocated || b.allocated || b.allocatedCount || 0;
          if (!totalAllocated && Array.isArray(b.items)) {
            totalAllocated = b.items.reduce(
              (s: number, it: any) =>
                s + (it.allocated || it.allocatedQty || it.allocatedCount || 0),
              0
            );
            if (totalAllocated === 0) {
              // fallback to count of items
              totalAllocated = b.items.length;
            }
          }
          return {
            branchName,
            totalAllocated: totalAllocated || 0,
            totalItems: Array.isArray(b.items) ? b.items.length : undefined,
          };
        });

        this.overviewLoading = false;
      },
      () => (this.overviewLoading = false)
    );
  }

  create() {
    this.dialog
      .open(AllocationsFormComponent, {
        width: '680px',
        maxWidth: '95vw',
        maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.load();
          this.loadOverview();
        }
      });
  }

  monthView() {
    this.dialog.open(AllocationMonthViewDialogComponent, {
      width: '680px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });
  }

  view(id: string) {
    this.dialog.open(AllocationViewDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { id },
    });
  }
}
