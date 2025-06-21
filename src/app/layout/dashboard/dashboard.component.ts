import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

import { SwPush } from '@angular/service-worker';
import { WebpushService } from 'src/app/shared/services/webpush.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Amount Recieved', weight: 36000 },
  { position: 2, name: 'Pending Amount', weight: 15000 },
  { position: 3, name: 'Total Amount', weight: 41000 },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  places: Array<any> = [];
  userType = '';
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(
    public auth: AuthService,
    public order: OrderService
  ) {}

  ngOnInit() {
    this.userType = this.auth.getUserRole();
  }
}
