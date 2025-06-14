import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderapiService } from 'src/app/shared/services/orderapi.service';

@Component({
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.scss'],
})
export class DeliveryScheduleComponent implements OnInit {
  deliverySchedule = [];
  deliveryDate = new Date();
  constructor(private service: OrderapiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getDeliverySchedule();
  }

  getAllSchedule() {
    this.deliveryDate = null;
    this.getDeliverySchedule();
  }

  searchSchedule() {
    this.deliveryDate = this.deliveryDate ?? new Date();
    this.getDeliverySchedule();
  }

  getDeliverySchedule() {
    this.service.getDeliverySchedule(this.deliveryDate).subscribe({
      next: (response) => {
        const deliverySchedule = response as any;
        if (Array.isArray(deliverySchedule) && deliverySchedule.length > 0) {
          this.deliverySchedule = deliverySchedule.map(x => {
            const potentialDate = new Date(x.deliveryTime);
            if (!isNaN(potentialDate.getTime())) {
              x.deliveryTime = this.datePipe.transform(x.deliveryTime, 'dd/MM/yyyy hh:mm a');
            }
            return x;
          });
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
