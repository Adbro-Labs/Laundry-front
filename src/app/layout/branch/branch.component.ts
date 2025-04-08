import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BranchService } from 'src/app/shared/services/measure.service';
import { AddBranchComponent } from '../add-branch/add-branch.component';

@Component({
  selector: 'app-customer',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  customerDetails;
  tempCustomerList: any = [];
  query = '';
  constructor(
    private dialog: MatDialog,
    private branch: BranchService
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }
  showCustomerDialog() {
    this.dialog
      .open(AddBranchComponent, { disableClose: true, width: '400px' })
      .afterClosed()
      .subscribe((data) => {
        this.getAllCustomers();
      });
  }
  getAllCustomers() {
    this.branch.getAllBranch().subscribe((data) => {
      this.customerDetails = data;
      this.tempCustomerList = data;
    });
  }
  searchCustomer() {
    this.tempCustomerList = this.customerDetails.filter(
      (x) => x.customerName.includes(this.query) || x.mobile.toString().includes(this.query)
    );
  }
  editBranch(branchDetails) {
    this.dialog
      .open(AddBranchComponent, { disableClose: true, width: '400px', data: branchDetails })
      .afterClosed()
      .subscribe((data) => {
        this.getAllCustomers();
      });
  }
}
