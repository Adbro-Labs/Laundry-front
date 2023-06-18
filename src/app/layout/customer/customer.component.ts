import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
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
  query = new FormControl('');
  index = 0;
  disableNext;
  constructor(private dialog: MatDialog, private customer: CustomerService) { }

  ngOnInit(): void {
    this.getAllCustomers();
    this.query.valueChanges
    .pipe(debounceTime(400))
    .subscribe(data => {
      this.getAllCustomers(data);
    })
  }
  showCustomerDialog() {
    this.dialog.open(AddCustomerComponent, { disableClose: true, width: '400px'}).afterClosed().subscribe(data => {
      this.getAllCustomers();
    });
  }
  getAllCustomers(query = "") {
    this.disableNext = false;
    this.customer.getAllCustomers(this.index, query).subscribe(data => {
      this.tempCustomerList = data;
      if (data && (data as any).length < 1) {
        this.disableNext = true;
      }
    });
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
  updateIndexAndGetOrderList(value) {
    const check = this.index + value;
    if (check >= 0) {
      this.index = check;
      this.getAllCustomers();
    }
  }
}
