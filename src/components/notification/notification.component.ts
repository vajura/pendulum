import { Component, OnInit } from '@angular/core';
import { NotificationType } from '../../models/enums/notification-enum';
import { NotificationService } from '../../services/notification-service';
import { NotificationInterface } from '../../models/interfaces/notification-interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notification: NotificationInterface;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
      this.notificationService.notification.subscribe((notifData: NotificationInterface) => {
          if (!notifData) {
              return;
          }
          this.notification = notifData;
          setTimeout(() => {
             this.notification = null;
          }, this.notification.displayTime);
      });
  }

  cssClass(notif: NotificationInterface) {
      if (notif.type === NotificationType.INFO) {
          return 'info';
      }
      if (notif.type === NotificationType.SUCCESS) {
          return 'success';
      }
      if (notif.type === NotificationType.ERROR) {
          return 'danger';
      }
  }
}
