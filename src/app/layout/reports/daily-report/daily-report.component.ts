import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { BillHistoryDialogComponent } from './bill-history-dialog/bill-history-dialog.component';
import { CloseBillDialogComponent } from './close-bill-dialog/close-bill-dialog.component';
import { ReportService } from '../shared/report.service';
import { finalize } from 'rxjs/operators';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

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
    private branch: BranchService,
    private dialog: MatDialog,
    private order: OrderapiService
  ) {}

  ngOnInit(): void {
    const date = this.route.snapshot.queryParams.date;
    this.status = this.route.snapshot.queryParams.status;
    this.branchCode = this.route.snapshot.queryParams.branchCode;
    this.userType = this.auth.getUserRole();
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
    return '';
  }

  async viewBillHistory(item) {
    const startIndex = this.report.indexOf(item);
    const billHistory = await this.order.getBillHistory(item.orderNumber, item.branchCode).toPromise();
    console.log(billHistory, "history");
    this.dialog.open(BillHistoryDialogComponent, {
      width: '450px',
      data: {
        bills: billHistory,
        startIndex: startIndex >= 0 ? startIndex : 0,
        findBranch: (code: string) => this.findBranch(code),
      },
    });
  }

  viewCloseBill(item) {
    this.dialog
      .open(CloseBillDialogComponent, {
        width: '420px',
        data: { orderNumber: item.orderNumber },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.closeBill(item, result);
        }
      });
  }

  closeBill(item, result) {
    console.log('Closing bill:', item);
    console.log('Status:', result.status);
    console.log('Description:', result.description);
    this.order.closeBillWithStatus(item.orderNumber, result.status, result.remarks, item.branchCode).subscribe(() => {
      this.getDailyReport();
    });
  }
}
