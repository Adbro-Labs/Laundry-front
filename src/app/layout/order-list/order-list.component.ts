import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
orderDetails;
index = 0;
limit = 15;
disableNext = false;
searchText = "";
  constructor(private order: OrderapiService, private auth: AuthService) { }

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.order.getAllOrders(this.index, this.limit, this.searchText, this.auth.decodeJwt().branchCode).subscribe(data => {
      this.orderDetails = data;
      if (this.orderDetails && this.orderDetails.length < 1) {
        this.disableNext = true;
      }
    }, errro => {
      this.orderDetails = [];
      this.disableNext = true;
    })
  }
  updateIndexAndGetOrderList(value) {
    const check = this.index + value;
    if (check >= 0) {
      this.index = check;
      this.getOrders();
    }
  }
}
