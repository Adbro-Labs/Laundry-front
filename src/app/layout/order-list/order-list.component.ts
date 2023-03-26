import { Component, OnInit } from '@angular/core';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
orderDetails;
  constructor(private order: OrderapiService) { }

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.order.getAllOrders().subscribe(data => {
      this.orderDetails = data;
    })
  }
}
