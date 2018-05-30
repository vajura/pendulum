import { NotificationType } from '../enums/notification-enum';


export interface NotificationInterface {
  type: NotificationType;
  title: string;
  message: string;
  displayTime: number;
  closeable: boolean;
}
