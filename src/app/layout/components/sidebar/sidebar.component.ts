import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public showMenu: string;
  userType;
  isSuperAdmin = false;
  isGroceryBranch = false;
  private routerSubscription: Subscription;
  private closeAfterNavigation = false;

  constructor(
    private auth: AuthService,
    private order: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.showMenu = '';
    this.userType = this.auth.getUserRole();
    this.isSuperAdmin = this.auth.isSuperAdmin();
    this.isGroceryBranch = this.auth.decodeJwt()?.businessType === 'GROCERY';
    this.routerSubscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        this.closeAfterNavigation &&
        this.isMobileViewport()
      ) {
        this.order.hideSidebars();
        this.closeAfterNavigation = false;
      }

      if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.closeAfterNavigation = false;
      }
    });
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  closeSidebarAfterNavigation() {
    this.closeAfterNavigation = this.isMobileViewport();
  }

  private isMobileViewport(): boolean {
    return window.innerWidth <= 992;
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
