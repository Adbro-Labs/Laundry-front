import { Component, OnInit } from '@angular/core';
import { OrderService } from './shared/services/order.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private order: OrderService) {
    }

    ngOnInit() {
        this.order.showSidebars();
    }
}
