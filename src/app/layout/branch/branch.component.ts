import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { StoreService } from 'src/app/shared/services/store.service';
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
  userType = '';
  isSuperAdmin = false;
  selectedStoreCode = '';
  stores: any[] = [];
  constructor(
    private dialog: MatDialog,
    private branch: BranchService,
    private auth: AuthService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.userType = this.auth.decodeJwt()?.userType;
    this.isSuperAdmin = this.auth.isSuperAdmin();
    if (!this.isSuperAdmin) {
      this.selectedStoreCode = this.auth.getStoreCode() || '';
    }
    this.loadStores();
  }
  loadStores() {
    this.storeService.getAllStore().subscribe((data: any) => {
      this.stores = data || [];
      if (!this.isSuperAdmin && !this.selectedStoreCode) {
        this.selectedStoreCode = this.auth.getStoreCode() || '';
      }
      this.getAllCustomers();
    });
  }
  onStoreChange(storeCode) {
    this.selectedStoreCode = storeCode;
    this.getAllCustomers();
  }
  showCustomerDialog() {
    if (this.isSuperAdmin && !this.selectedStoreCode) {
      return;
    }
    this.dialog
      .open(AddBranchComponent, {
        disableClose: true,
        width: '400px',
        data: { storeCode: this.selectedStoreCode },
      })
      .afterClosed()
      .subscribe(data => {
        this.getAllCustomers();
      });
  }
  getAllCustomers() {
    if (this.isSuperAdmin && !this.selectedStoreCode) {
      this.customerDetails = [];
      this.tempCustomerList = [];
      return;
    }

    this.branch.getAllBranch(this.selectedStoreCode).subscribe(data => {
      this.customerDetails = data;
      this.tempCustomerList = data;
    });
  }
  searchCustomer() {
    this.tempCustomerList = this.customerDetails.filter(
      x =>
        x.customerName.includes(this.query) ||
        x.mobile.toString().includes(this.query)
    );
  }
  editBranch(branchDetails) {
    this.dialog
      .open(AddBranchComponent, {
        disableClose: true,
        width: '400px',
        data: {
          ...branchDetails,
          storeCode: branchDetails.storeCode || this.selectedStoreCode,
        },
      })
      .afterClosed()
      .subscribe(data => {
        this.getAllCustomers();
      });
  }
  approveBranch(branchDetails) {
    this.branch.approveBranch(branchDetails._id).subscribe(() => {
      this.getAllCustomers();
    });
  }
  canApproveBranch() {
    return this.userType === 'SUPER_ADMIN';
  }
  findStore(storeCode) {
    if (!storeCode) {
      return '-';
    }
    const store = this.stores.find(item => item.storeCode === storeCode);
    return store?.storeName || storeCode;
  }
}
