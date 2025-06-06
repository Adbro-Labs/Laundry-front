import { Component, OnInit } from '@angular/core';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.scss'],
})
export class DeliveryScheduleComponent implements OnInit {
  deliverySchedule = [];
  constructor(private service: OrderapiService) {}

  ngOnInit(): void {
    this.getDeliverySchedule();
  }

  getDeliverySchedule() {
    this.service.getDeliverySchedule().subscribe({
      next: (response) => {
        this.deliverySchedule = response as any;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
