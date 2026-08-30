import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/measure.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { AddBranchUserComponent } from '../add-branch-user/add-branch-user.component';

@Component({
  selector: 'app-branch-users',
  templateUrl: './branch-users.component.html',
  styleUrls: ['./branch-users.component.scss'],
})
export class BranchUsersComponent implements OnInit {
  stores: any[] = [];
  branches: any[] = [];
  users: any[] = [];
  selectedStoreCode = '';
  selectedBranchCode = '';
  errorMessage = '';
  isSuperAdmin = false;

  constructor(
    private dialog: MatDialog,
    private auth: AuthService,
    private branch: BranchService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.selectedStoreCode = this.auth.getStoreCode() || '';
    if (this.isSuperAdmin) {
      this.loadStores();
    } else {
      this.loadBranches();
    }
  }

  loadStores() {
    this.storeService.getAllStore().subscribe((data: any) => {
      this.stores = data || [];
    });
  }

  onStoreChange(storeCode: string) {
    this.selectedStoreCode = storeCode;
    this.selectedBranchCode = '';
    this.branches = [];
    this.users = [];
    this.loadBranches();
  }

  loadBranches() {
    if (!this.selectedStoreCode) {
      return;
    }
    this.branch.getAllBranch(this.selectedStoreCode).subscribe((data: any) => {
      this.branches = data || [];
    });
  }

  onBranchChange(branchCode: string) {
    this.selectedBranchCode = branchCode;
    this.users = [];
    if (!branchCode) {
      return;
    }
    this.auth.getBranchUsers(branchCode).subscribe({
      next: (data: any[]) => (this.users = data || []),
      error: error =>
        (this.errorMessage = error?.error?.message || 'Unable to load users'),
    });
  }

  openUserDialog(user = null) {
    if (!this.selectedBranchCode) {
      return;
    }
    this.errorMessage = '';
    this.dialog
      .open(AddBranchUserComponent, {
        disableClose: true,
        width: '400px',
        data: { branchCode: this.selectedBranchCode, user },
      })
      .afterClosed()
      .subscribe(saved => {
        if (saved) {
          this.onBranchChange(this.selectedBranchCode);
        }
      });
  }

  findStoreName() {
    return (
      this.stores.find(store => store.storeCode === this.selectedStoreCode)
        ?.storeName || ''
    );
  }

  findBranchName() {
    return (
      this.branches.find(
        branch => branch.branchCode === this.selectedBranchCode
      )?.branchName || ''
    );
  }
}
