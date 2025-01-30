import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Message } from '../messaging/messaging.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private readonly API_URL = environment.API_URL;
  constructor() {
    this.socket = io('');
  }

  listenForMessages(callback: (message: Message) => void) {
    this.socket.on('newMessage', callback);
  }

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }
}
