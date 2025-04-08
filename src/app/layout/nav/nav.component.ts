import { Observable } from 'rxjs';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  showSidebar = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private order: OrderService
  ) {}
  ngOnInit() {
    this.order.showSidebarAgent.subscribe((data: boolean) => {
      this.showSidebar = data;
    });
  }
}
