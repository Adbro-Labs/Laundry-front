import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public showMenu: string;
  userType;
  isSuperAdmin = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.showMenu = '';
    this.userType = this.auth.getUserRole();
    this.isSuperAdmin = this.auth.isSuperAdmin();
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
}
