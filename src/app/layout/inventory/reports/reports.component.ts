import { Component, OnInit } from '@angular/core';
import { InventoryReportService } from 'src/app/shared/services/inventory-report.service';

@Component({
  selector: 'app-inventory-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  centralStock = [];
  loading = false;

  constructor(private svc: InventoryReportService) {}

  ngOnInit(): void {
    this.loadCentral();
  }

  loadCentral() {
    this.loading = true;
    this.svc.getCentralStockReport().subscribe(
      (res: any) => {
        this.centralStock = res.data || res;
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  getStockClass(report: any): string {
    const currentStock = Number(report.currentStock || 0);
    const minimumStock = Number(report.minimumStockLevel || 0);

    if (minimumStock <= 0 || currentStock >= minimumStock) return '';
    if (currentStock < minimumStock * 0.8) return 'stock-critical';
    return 'stock-warning';
  }
}
