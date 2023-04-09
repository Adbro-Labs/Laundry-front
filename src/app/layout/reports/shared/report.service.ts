import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getMonthlyReport(month, year) {
    const url = environment.apiUrl + `order/getReportSummaryByMonth?month=${month}&year=${year}`;
    return this.http.get(url);
  }
  getDailyReport(date) {
    const url = environment.apiUrl + `order/getDailyReport?date=${date}`;
    return this.http.get(url);
  }
}
