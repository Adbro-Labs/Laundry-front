import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';
import { ReportService } from '../shared/report.service';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.scss'],
})
export class CustomerStatementComponent implements OnInit {
  orders = [];
  year;
  month;
  total = {
    amount: 0,
    discount: 0,
    netTotal: 0,
  };
  monthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  yearList = [2023, 2024, 2025];
  branches = [];
  branchCode = '';
  userRole = '';
  selectedBranchCode = '';
  customerId = '';
  mobileNumber = new FormControl('');
  tempCustomerList = [];
  branchDetails;
  customerDetails;
  statusList = ['PENDING', 'PAID', 'DELIVERED'];
  status;
  constructor(
    private service: ReportService,
    private router: Router,
    private branch: BranchService,
    private auth: AuthService,
    private customer: CustomerService,
    private orderApi: OrderapiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.userRole = this.auth.getUserRole();
    if (this.userRole != 'ADMIN') {
      this.branchCode = this.auth.decodeJwt()?.branchCode;
    }
    this.getBranches();
    this.mobileNumber.valueChanges.pipe(debounceTime(300)).subscribe((data) => {
      if (typeof data == 'string') {
        if (data.length < 1) {
          this.customerId = null;
        }
        this.searchCustomers(data);
      }
    });
    this.getBranchDetails(this.auth.decodeJwt()?.branchCode);
  }
  getBranches() {
    this.branch.getAllBranch().subscribe((data) => {
      this.branches = data as any;
    });
  }

  searchCustomers(query) {
    this.customer.findCustomer(query).subscribe((data) => {
      this.tempCustomerList = data as any;
    });
  }

  getMonthlyReport() {
    this.service
      .getCustomerMonthlyReport(
        this.month,
        this.year,
        this.branchCode,
        this.customerId,
        this.status
      )
      .subscribe((data) => {
        this.orders = data as any;
        if (this.customerId) {
          this.customerDetails = this.mobileNumber.value;
        }
        this.total = {
          amount: 0,
          discount: 0,
          netTotal: 0,
        };
        if (this.orders.length > 0) {
          this.total.amount = this.getSumofItems(this.orders.map((x) => x.total));
          this.total.discount = this.getSumofItems(this.orders.map((x) => x.discount));
          this.total.netTotal = this.getSumofItems(this.orders.map((x) => x.netTotal));
        }
        this.selectedBranchCode = this.branchCode;
        if (!this.branchDetails) {
          this.getBranchDetails(this.selectedBranchCode);
        }
      });
  }
  getSumofItems = (list) => {
    const sum = list.reduce((partialSum, a) => Number(partialSum) + Number(a), 0);
    return sum;
  };
  openDailyReport(date) {
    this.router.navigate(['/reports/daily'], {
      queryParams: { date, branchCode: this.selectedBranchCode },
    });
  }
  setCustomerDetails() {
    const user = this.mobileNumber.value;
    if (user) {
      this.customerId = (user as any)._id;
    }
  }
  displayFn(user): string {
    const customerName = user && user.customerName ? user.customerName : '';
    const customerMobile = user && user.mobile ? user.mobile : '';
    if (customerName || customerMobile) {
      return `${customerName}`;
    }
    return '';
  }
  clearCustomerId(event: Event) {
    event.preventDefault();
    this.mobileNumber.reset();
    this.customerId = null;
    this.customerDetails = null;
    this.orders = [];
    this.total = {
      amount: 0,
      discount: 0,
      netTotal: 0,
    };
  }
  getBranchDetails(branchCode) {
    this.customer.getBranchByCode(branchCode).subscribe((data) => {
      this.branchDetails = data as any;
    });
  }
  printReciept() {
    const elementIdsToHide = [];
    this.orderApi.getInvoiceReportTemplate().subscribe((htmlString) => {
      htmlString = htmlString.replace('[ORDER_NO]', '');
      htmlString = htmlString.replace(
        '[CUSTOMER_NAME]',
        this.customerDetails?.customerName || this.branchDetails.branchName
      );
      htmlString = htmlString.replace('[CUSTOMER_MOBILE]', this.customerDetails?.mobile);
      htmlString = htmlString.replace(
        '[DATE]',
        this.datePipe.transform(new Date(), 'dd-MM-yyyy', '+0400')
      );
      htmlString = htmlString.replace('[SHOPNAME]', this.branchDetails?.title);
      htmlString = htmlString.replace('[TITLE]', this.branchDetails?.title);
      htmlString = htmlString.replace('[SUBTITLE1]', this.branchDetails?.subtitle1);
      htmlString = htmlString.replace('[SUBTITLE2]', this.branchDetails?.subtitle2);
      htmlString = htmlString.replace('[IMAGE_URL]', this.branchDetails?.imageUrl);
      if (!this.customerDetails) {
        elementIdsToHide.push('customerDetails');
      }
      let itemsString;
      let subTotal = 0;
      let totalQty = 0;
      this.orders.forEach((el) => {
        const item = `<tr>
         <td style="text-align: left;">${this.datePipe.transform(el.orderDate, 'dd-MM-yyyy', '+0400')}</td>
         <td>${el.orderNumber}</td>
         <td>${Number(el.netTotal).toFixed(2)}</td>
         </tr>`;
        itemsString += item;
        subTotal += Number(el.total);
        if (Number(el.quantity)) {
          totalQty += Number(el.quantity);
        }
      });
      htmlString = htmlString.replace('[TOTAL_ITEMS]', totalQty.toString());
      htmlString = htmlString.replace('[itemDetails]', itemsString);
      elementIdsToHide.push('discountLabel');
      htmlString = htmlString.replace('[NETTOTAL]', Number(this.total.netTotal).toFixed(2));
      elementIdsToHide.push('notelabel');
      htmlString = htmlString.replace('[DELIVREY_TYPE]', '');
      elementIdsToHide.push('deliveryTimeLabel');
      htmlString = htmlString.split('undefined').join('');
      var printWindow = window.open('', '', 'height=600,width=900');
      printWindow.document.write(`<html><head><title>${this.branchDetails?.title}</title>`);
      printWindow.document.write('</head><body>');
      printWindow.document.write(htmlString);
      //  printWindow.document.getElementById("qtylabel").innerText = "Bill No";
      //  printWindow.document.getElementById("pricelabel").innerText = "";
      //  printWindow.document.getElementById("itemLabel").innerText = "Date";
      elementIdsToHide.push('totalItems');
      elementIdsToHide.push('deliveryTypeLabel');
      elementIdsToHide.push('billno');
      elementIdsToHide.forEach((data) => {
        const element = printWindow.document.getElementById(data);
        if (element) {
          element.style.display = 'none';
        }
      });
      printWindow.document.write('</body></html>');
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 750);
    });
  }
}
