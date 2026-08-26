import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryReportService {
  constructor(private http: HttpClient) {}

  getCentralStockReport() {
    const url = environment.apiUrl + 'reports/inventory/central-stock';
    return this.http.get(url);
  }

  getBranchStockReport(branchId?: string) {
    let url = environment.apiUrl + 'reports/inventory/branch-stock';
    if (branchId) url += `?branchId=${branchId}`;
    return this.http.get(url);
  }

  getPurchaseReport(filter: any) {
    const params = [];
    if (filter.supplierId) params.push(`supplierId=${filter.supplierId}`);
    if (filter.from) params.push(`from=${filter.from}`);
    if (filter.to) params.push(`to=${filter.to}`);
    const url = environment.apiUrl + 'reports/inventory/purchase' + (params.length ? `?${params.join('&')}` : '');
    return this.http.get(url);
  }

  getSupplierOutstandingReport() {
    const url = environment.apiUrl + 'reports/inventory/supplier-outstanding';
    return this.http.get(url);
  }

  getAllocationHistory(filter: any) {
    // backend may accept queries, using /stock-allocation for now
    const url = environment.apiUrl + 'reports/inventory/stock-allocation';
    return this.http.get(url);
  }

  /**
   * Stock overview - central and branch-wise stock and allocations
   * Expected response shape: { central: [...], branches: [...] } or resp.data
   */
  getStockOverview() {
    const url = environment.apiUrl + 'reports/inventory/stock-overview';
    return this.http.get(url);
  }
}
