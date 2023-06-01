import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getMonthlyReport(month, year, branch = "", customerId = null) {
    let url = environment.apiUrl + `order/getReportSummaryByMonth?month=${month}&year=${year}&branchCode=${branch}`;
    if (customerId) {
      url += `&customerId=${customerId}`
    }
    return this.http.get(url);
  }
  getCustomerMonthlyReport(month, year, branch = "", customerId = null) {
    let url = environment.apiUrl + `order/getCustomerSummaryByMonth?month=${month}&year=${year}&branchCode=${branch}`;
    if (customerId) {
      url += `&customerId=${customerId}`
    }
    return this.http.get(url);
  }
  getDailyReport(date, branch = "") {
    const url = environment.apiUrl + `order/getDailyReport?date=${date}&branchCode=${branch}`;
    return this.http.get(url);
  }
}
