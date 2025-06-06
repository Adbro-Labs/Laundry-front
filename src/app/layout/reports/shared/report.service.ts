import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getMonthlyReport(month, year, branch = '', customerId = null, status = null) {
    let url =
      environment.apiUrl +
      `order/getReportSummaryByMonth?month=${month}&year=${year}&branchCode=${branch}`;
    if (customerId) {
      url += `&customerId=${customerId}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get(url);
  }



  getBillCount(month, year, branch = '') {
   let url = environment.apiUrl + `order/getBillsCount?month=${month}&year=${year}`;

    if (branch) {
      url += `&branchCode=${branch}`;
    }

    return this.http.get(url);
  }
  getCustomerMonthlyReport(month, year, branch = '', customerId = null, status = null) {
    let url =
      environment.apiUrl +
      `order/getCustomerSummaryByMonth?month=${month}&year=${year}&branchCode=${branch}&status=${status}`;
    if (customerId) {
      url += `&customerId=${customerId}`;
    }
    return this.http.get(url);
  }
  getDailyReport(date, branch = '', status = null) {
    if (status) {
      const url =
        environment.apiUrl +
        `order/getDailyReport?date=${date}&branchCode=${branch}&status=${status}`;
      return this.http.get(url);
    }

    const url = environment.apiUrl + `order/getDailyReport?date=${date}&branchCode=${branch}`;
    return this.http.get(url);
  }

  downloadDailyReport(date, branch = '') {
    const url = environment.apiUrl + `order/downloadDailyReport?date=${date}&branchCode=${branch}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
