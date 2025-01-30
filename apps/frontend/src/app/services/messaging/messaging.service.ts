import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private baseUrl = environment.API_URL + 'messages';
  private socket!: Socket;
  private newMessageSubject = new Subject<Message>();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const token = this.authService.getToken();

    this.socket = io(environment.API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    this.socket.on('newMessage', (message: Message) => {
      console.log('📩 New message received:', message);
      this.newMessageSubject.next(message);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('🔌 WebSocket disconnected:', reason);
      setTimeout(() => this.connectWebSocket(), 5000);
    });
  }

   emitMessage(message: Message) {
    console.log('📤 Emitting message via WebSocket:', message);
    this.socket.emit('sendMessage', message);
  }

  sendMessage(receiverId: string, content: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.baseUrl}/send`,
      { receiverId, content },
      { headers: this.getHeaders() }
    );
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  markAsRead(messageId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${messageId}/read`, {}, { headers: this.getHeaders() });
  }

  listenForMessages(): Observable<Message> {
    return this.newMessageSubject.asObservable();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
