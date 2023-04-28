import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
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
  branches = [];
  branchCode = "";
  userRole = "";
  selectedBranchCode = "";
  constructor(private service: ReportService, private router: Router, private branch: BranchService, private auth: AuthService) { }

  ngOnInit(): void {
    this.year = (new Date().getFullYear());
    this.month = (new Date().getMonth() + 1);
    this.getMonthlyReport();
    this.userRole = this.auth.getUserRole();
    this.getBranches();
  }
  getBranches() {
    this.branch.getAllBranch().subscribe(data => {
      this.branches = (data as any);
    })
  }
  
  getMonthlyReport() {
    this.service.getMonthlyReport(this.month, this.year, this.branchCode).subscribe(data => {
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
      this.selectedBranchCode = this.branchCode;
    });
  }
  getSumofItems = (list) => {
    const sum = list.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
    return sum;
  }
  openDailyReport(date) {
    this.router.navigate(['/reports/daily'], {queryParams: {date, branchCode: this.selectedBranchCode}});
  }
}
