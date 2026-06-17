export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  conversationName: string;
  message: string;
  file: string | null;
  createdAt: Date;
}

export default class Message {
  private _id: string;
  private _senderId: string;
  private _receiverId: string;
  private _conversationName: string;
  private _message: string;
  private _file: string | null;
  private _createdAt: Date;

  constructor(data: IMessage) {
    this._id = data.id;
    this._senderId = data.senderId;
    this._receiverId = data.receiverId;
    this._conversationName = data.conversationName;
    this._message = data.message;
    this._file = data.file;
    this._createdAt = data.createdAt;
  }

  get id() {
    return this._id;
  }

  get senderId() {
    return this._senderId;
  }

  get receiverId() {
    return this._receiverId;
  }

  get conversationName() {
    return this._conversationName;
  }

  get message() {
    return this._message;
  }

  get file() {
    return this._file;
  }

  get createdAt() {
    return this._createdAt;
  }
}