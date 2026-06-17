export interface INotification {
  id: string;
  sender: { id: string };
  recipient: { id: string };
  notification_type: string;
  title?: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export default class Notification {
  private _id: string;
  private _senderId: string;
  private _recipientId: string;
  private _notificationType: string;
  private _title: string;
  private _message: string;
  private _timestamp: Date;
  private _read: boolean;

  constructor(notification: any) {
    this._id = notification.id;
    this._senderId = notification.senderId;
    this._recipientId = notification.recipientId;
    this._notificationType = notification.notificationType;
    this._title = notification.title || "";
    this._message = notification.message;
    this._timestamp = new Date(notification.timestamp);
    this._read = notification.read ?? false;
  }

  get id(): string { return this._id; }
  get senderId(): string { return this._senderId; }
  get recipientId(): string { return this._recipientId; }
  get notificationType(): string { return this._notificationType; }
  get title(): string { return this._title; }
  get message(): string { return this._message; }
  get timestamp(): Date { return this._timestamp; }
  get read(): boolean { return this._read; }
}