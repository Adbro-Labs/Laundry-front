import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from 'src/app/shared/services/item.service';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-customer',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  customerDetails;
  constructor(private dialog: MatDialog, private item: ItemService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }
  showCustomerDialog() {
    this.dialog.open(AddItemComponent, { disableClose: true, width: '400px'}).afterClosed().subscribe((response: any) => {
      this.getAllCustomers();
    });
  }
  getAllCustomers() {
    this.item.getAllItems().subscribe(data => {
      this.customerDetails = data;
    });
  }
  editItem(item) {
    this.dialog.open(AddItemComponent, { disableClose: true, width: '400px', data: item}).afterClosed().subscribe((response: any) => {
      this.getAllCustomers();
    });
  }
}
