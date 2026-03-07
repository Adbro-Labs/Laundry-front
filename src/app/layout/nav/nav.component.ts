import { Observable } from 'rxjs';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  showSidebar = false;
  isLoading$ = this.loader.loading$;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private order: OrderService,
    private loader: LoaderService
  ) {}
  ngOnInit() {
    this.order.showSidebarAgent.subscribe((data: boolean) => {
      this.showSidebar = data;
    });
  }
}
