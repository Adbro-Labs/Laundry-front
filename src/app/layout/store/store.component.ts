import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStoreComponent } from '../add-store/add-store.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  storeDetails: any[] = [];
  tempStoreList: any[] = [];
  userType = '';
  message = '';

  constructor(
    private dialog: MatDialog,
    private storeService: StoreService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userType = this.auth.decodeJwt()?.userType;
    this.getAllStores();
  }

  getAllStores() {
    this.storeService.getAllStore().subscribe((data: any) => {
      this.storeDetails = data || [];
      this.tempStoreList = data || [];
    });
  }

  showStoreDialog() {
    this.dialog
      .open(AddStoreComponent, { disableClose: true, width: '420px' })
      .afterClosed()
      .subscribe(() => this.getAllStores());
  }

  editStore(storeDetails) {
    this.dialog
      .open(AddStoreComponent, { disableClose: true, width: '420px', data: storeDetails })
      .afterClosed()
      .subscribe(() => this.getAllStores());
  }

  toggleStore(storeDetails) {
    this.storeService.toggleStoreActive(storeDetails._id, !storeDetails.active).subscribe(() => {
      this.getAllStores();
    });
  }

  linkBranches(storeDetails) {
    this.message = '';
    this.storeService.linkExistingBranchesToStore(storeDetails._id).subscribe((data: any) => {
      this.message = `${data?.linkedCount || 0} existing branches linked to ${storeDetails.storeName}`;
      this.getAllStores();
    });
  }

  isSuperAdmin() {
    return this.auth.isSuperAdmin();
  }
}
