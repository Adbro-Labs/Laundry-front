import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../shared/report.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  date;
  branchCode = "";
  report = [];
  total = {
    amount: 0,
    discount: 0,
    netTotal: 0
  }
  constructor(private route: ActivatedRoute, private service: ReportService) { }

  ngOnInit(): void {
    const date = this.route.snapshot.queryParams.date;
    this.branchCode = this.route.snapshot.queryParams.branchCode;
    if (date) {
      this.date = new Date(date);
    }
    this.getDailyReport();
  }
  getDailyReport() {
    if (this.date) {
      this.service.getDailyReport(this.date, this.branchCode).subscribe(data => {
        this.report = (data as any);
        this.total = {
          amount: 0,
          discount: 0,
          netTotal: 0
        }
        if (this.report.length > 0) {
          this.total.amount = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.total));
          this.total.discount = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.discount));
          this.total.netTotal = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.netTotal));
        }
      });
    }
  }
  getSumofItems = (list) => {
    const sum = list.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
    return sum;
  }
}
