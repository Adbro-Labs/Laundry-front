import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from './shared/services/order.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private translate: TranslateService, private order: OrderService) {
        translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.order.showSidebars();
    }
}
