import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ItemService } from 'src/app/shared/services/item.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { startWith,map } from 'rxjs/operators';
import { CustomerService } from 'src/app/shared/services/customer.service';
@Component({
  selector: 'app-customer',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  customerDetails;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  constructor(private dialog: MatDialog, private item: ItemService, private customer: CustomerService) { }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getCustomers();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  getCustomers() {
    this.customer.getAllCustomers().subscribe(data => {
      this.options = (data as any);
    });
  }
  showCustomerDialog() {
    this.dialog.open(AddItemComponent, { disableClose: true, width: '400px'}).afterClosed().subscribe((response: any) => {
      this.getAllCustomers();
    });
  }
  getAllCustomers() {
    const customerId = this.myControl?.value?._id;
    this.item.getAllItems(customerId).subscribe(data => {
      this.customerDetails = data;
    });
  }
  editItem(item) {
    const customerId = this.myControl?.value?._id;
    if (customerId) {
      item.customerId = customerId;
    }
    this.dialog.open(AddItemComponent, { disableClose: true, width: '400px', data: item}).afterClosed().subscribe((response: any) => {
      this.getAllCustomers();
    });
  }
  private _filter(value: string): string[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option?.customerName?.toLowerCase()?.indexOf(filterValue) === 0 || option?.mobile?.toString()?.indexOf(filterValue) === 0);
    }
  }
  displayFn(user): string {
    const customerName =  user && user.customerName ? user.customerName : '';
    const customerMobile =  user && user.mobile ? user.mobile : '';
    if (customerName || customerMobile) {
      return `${customerName}`;
    }
    return "";
  }
  getCustomerPricing() {
    const customerId = this.myControl?.value?._id;
    if (customerId) {
      this.getAllCustomers();
    }
  }
  showDefaultPricing() {
    this.myControl.reset();
    this.getAllCustomers();
  }
}
