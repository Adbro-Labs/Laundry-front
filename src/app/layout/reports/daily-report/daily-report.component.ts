import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { ReportService } from '../shared/report.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss'],
})
export class DailyReportComponent implements OnInit {
  date: Date;
  status = '';
  branchCode = '';
  isDownloading = false;
  report = [];
  total = {
    amount: 0,
    discount: 0,
    netTotal: 0,
    vatTotal: 0,
    roundoffTotal: 0
  }
  branches = [];
  userType = '';
  constructor(
    private route: ActivatedRoute,
    private service: ReportService,
    private auth: AuthService,
    private branch: BranchService
  ) {}

  ngOnInit(): void {
    const date = this.route.snapshot.queryParams.date;
    this.status = this.route.snapshot.queryParams.status;
    this.branchCode = this.route.snapshot.queryParams.branchCode;
    if (date) {
      const dateWithoutHour = new Date(date).setHours(0, 0, 0, 0);
      this.date = new Date(dateWithoutHour);
    }
    this.getDailyReport();
    this.getBranches();
  }
  getDailyReport() {
    if (this.date) {
      this.userType = this.auth.getUserRole();
      if (this.userType !== 'ADMIN' && !this.branchCode) {
        return;
      }
      this.service.getDailyReport(this.date, this.branchCode, this.status).subscribe((data) => {
        this.report = data as any;
        this.total = {
          amount: 0,
          discount: 0,
          netTotal: 0,
          vatTotal: 0,
          roundoffTotal: 0
        }
        if (this.report.length > 0) {
          this.total.amount = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.total));
          this.total.discount = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.discount));
          this.total.netTotal = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.netTotal));
          this.total.roundoffTotal = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.roundoffAmount));
          this.total.vatTotal = this.getSumofItems(this.report.filter(x => x.status != 'CANCELLED').map(x => x.vatAmount));
        }
      });
    }
  }
  getSumofItems = (list) => {
    const sum = list.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
    return sum;
  };
  getBranches() {
    this.branch.getAllBranch().subscribe((data) => {
      this.branches = data as any;
    });
  }

  downloadPdf() {
    this.isDownloading = true;
    this.service
      .downloadDailyReport(this.date, this.branchCode)
      .pipe(
        finalize(() => {
          this.isDownloading = false;
        })
      )
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          //download the file
          // const link = document.createElement('a');
          // link.href = url;
          // link.download = 'report.pdf';
          // link.click();

          window.open(url);
        },
        error: (err) => {
          console.error('Error downloading PDF:', err);
        },
      });
  }

  findBranch(branchCode) {
    if (this.branches && this.branches.length > 0) {
      const branch = this.branches.find((x) => x.branchCode == branchCode);
      if (branch) {
        return branch.branchName;
      }
    }
  }
}
