import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    public pushRightClass: string;
    orderNumber = new FormControl('');
    constructor(public router: Router, private translate: TranslateService, private order: OrderService) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.orderNumber.valueChanges.subscribe(data=> {
            if (data.length >= 4) {
                this.router.navigate(['/takeOrder', data]);
                setTimeout(() => {
                    this.orderNumber.setValue('');
                }, 3000);
            }
        });
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        // const dom: any = document.querySelector('body');
        // dom.classList.toggle(this.pushRightClass);
        this.order.toggleSidebars();
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
        this.router.navigate(['/login']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
    requestFullscreen() {
        document.documentElement.requestFullscreen();
    }
     
    goback() {
        window.history.back();
    }
    goforward() {
        window.history.forward();
    }
}
