import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NotificationInterface } from '../models/interfaces/notification-interface';
import { NotificationType } from '../models/enums/notification-enum';

@Injectable()
export class NotificationService {

  private displayTimeDefault = 5000;
  notification = new BehaviorSubject<NotificationInterface>(null);

  constructor() { }

  info(title: string, message: string, displayTime: number = this.displayTimeDefault, closeable: boolean = false) {
    this.showNotification(NotificationType.INFO, title, message, displayTime, closeable);
  }

  success(title: string, message: string, displayTime: number = this.displayTimeDefault, closeable: boolean = false) {
    this.showNotification(NotificationType.SUCCESS, title, message, displayTime, closeable);
  }

  error(title: string, message: string, displayTime: number = this.displayTimeDefault, closeable: boolean = false) {
    this.showNotification(NotificationType.ERROR, title, message, displayTime, closeable);
  }

  private showNotification(
    type: NotificationType,
    title: string,
    message: string,
    displayTime: number = null,
    closeable: boolean = false
  ) {
    this.notification.next({ type, title, message, displayTime, closeable } as NotificationInterface);
  }
}
