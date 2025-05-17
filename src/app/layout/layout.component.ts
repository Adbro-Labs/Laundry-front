import { Component, OnInit } from '@angular/core';
import { NotificationPermissionDialogComponent } from './notification-permission-dialog/notification-permission-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.requestNotificationPermission();
  }

  isDialogOpen = false;

  private async requestNotificationPermission(): Promise<void> {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        alert('Notifications allowed');
      } else if (!this.isDialogOpen) {
        this.openNotificationDialog(permission);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  openNotificationDialog(permission: NotificationPermission): void {
    this.isDialogOpen = true;

    const dialogRef = this.dialog.open(NotificationPermissionDialogComponent, {
      data: { permission },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.isDialogOpen = false;

      if (result === 'retry') {
        this.requestNotificationPermission();
      }
    });
  }
}
