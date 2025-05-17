import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-permission-dialog',
  templateUrl: './notification-permission-dialog.component.html',
})
export class NotificationPermissionDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<NotificationPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { permission: NotificationPermission }
  ) {}

  onRetry(): void {
    this.dialogRef.close('retry');
  }
}
