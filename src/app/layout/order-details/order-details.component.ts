import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private order: OrderService, private router: Router) { }

  ngOnInit(): void {
  }

  generateOrderNumber() {
    this.order.generateNewOrder();
  }

}
