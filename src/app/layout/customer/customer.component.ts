import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerDetails;
  constructor(private dialog: MatDialog, private customer: CustomerService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }
  showCustomerDialog() {
    this.dialog.open(AddCustomerComponent, { disableClose: true, width: '400px'});
  }
  getAllCustomers() {
    this.customer.getAllCustomers().subscribe(data => {
      this.customerDetails = data;
    });
  }
}
