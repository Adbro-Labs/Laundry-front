import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { WebpushService } from 'src/app/shared/services/webpush.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
})
export class TopnavComponent implements OnInit {
  public pushRightClass: string;
  orderNumber = new FormControl('');
  userDetails;
  readonly VAPID_PUBLIC_KEY = 'BEbE1WpMkxiJL8KR8K0tp1RFar0H5tAmLFy_Ps-JUbqGK5kM4ODCDySdDnOSEvXCEuKUKCOCgUWxHpGhtgGzcos';
  constructor(
    public router: Router,
    private order: OrderService,
    private auth: AuthService,
    private swPush: SwPush,
    private push: WebpushService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
    this.userDetails = auth.decodeJwt();
  }

  ngOnInit() {
    this.orderNumber.valueChanges.subscribe((data) => {
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

  requestFullscreen() {
    document.documentElement.requestFullscreen();
  }

  goback() {
    window.history.back();
  }
  goforward() {
    window.history.forward();
  }
    subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
     this.push.subscribeforPush(sub).subscribe({
        next: (response) => {
          console.log('Subscription successful', response);
        },
        error: (err) => {
          console.error('Subscription failed', err);
        }
      }
    );
    })
    .catch(err => console.error('Could not subscribe', err));
  }
}
