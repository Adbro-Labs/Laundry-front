import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from './shared/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  orders = [];
  year;
  month;
  total = {
    amount: 0,
    discount: 0,
    netTotal: 0
  }
  monthList = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  yearList = [2023, 2024, 2025];
  constructor(private service: ReportService, private router: Router) { }

  ngOnInit(): void {
    this.year = (new Date().getFullYear());
    this.month = (new Date().getMonth() + 1);
    this.getMonthlyReport();
  }
  getMonthlyReport() {
    this.service.getMonthlyReport(this.month, this.year).subscribe(data => {
      this.orders = (data as any);
      this.total = {
        amount: 0,
        discount: 0,
        netTotal: 0
      }
      if (this.orders.length > 0) {
        this.total.amount = this.getSumofItems(this.orders.map(x => x.total));
        this.total.discount = this.getSumofItems(this.orders.map(x => x.discount));
        this.total.netTotal = this.getSumofItems(this.orders.map(x => x.netTotal));
      }
    });
  }
  getSumofItems = (list) => {
    const sum = list.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
    return sum;
  }
  openDailyReport(date) {
    this.router.navigate(["/reports/daily", date]);
  }
}
