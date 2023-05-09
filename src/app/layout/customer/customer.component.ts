import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerDetails;
  tempCustomerList: any = [];
  query = "";
  constructor(private dialog: MatDialog, private customer: CustomerService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }
  showCustomerDialog() {
    this.dialog.open(AddCustomerComponent, { disableClose: true, width: '400px'}).afterClosed().subscribe(data => {
      this.getAllCustomers();
    });
  }
  getAllCustomers() {
    this.customer.getAllCustomers().subscribe(data => {
      this.customerDetails = data;
      this.tempCustomerList = data;
    });
  }
  searchCustomer() {
    this.tempCustomerList = this.customerDetails.filter(x => x.customerName?.toLowerCase().includes(this.query?.toLowerCase()) || x.mobile.toString().includes(this.query));
  }
  setPricing(customerId) {
    this.dialog.open(AddItemComponent, { disableClose: true, width: '400px', data: customerId}).afterClosed().subscribe((response: any) => {
      this.getAllCustomers();
    });
  }
  editCustomer(customer) {
    this.dialog.open(AddCustomerComponent, { disableClose: true, width: '400px', data: customer}).afterClosed().subscribe(data => {
      this.getAllCustomers();
    });
  }
}
