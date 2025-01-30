import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/messaging.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private users = new Map<string, string>(); // Track user -> socketId

  constructor(
    @Inject(forwardRef(() => MessagingService)) private messagingService: MessagingService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token; // ✅ Get token from `auth` payload
      if (!token) {
        console.warn('❌ No token provided, disconnecting client.');
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded: any = jwt.verify(token, secret);

      console.log(`✅ Client connected: ${client.id}, User: ${decoded.id}`);

      this.users.set(decoded.id, client.id); // Track user
      client.data.userId = decoded.id; // ✅ Store user ID in socket client
    } catch (error) {
      console.error('❌ Invalid token, disconnecting client.', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.warn(`🔌 Client disconnected: ${client.id}`);
    this.users.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.users.delete(userId);
      }
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() dto: SendMessageDto, @ConnectedSocket() client: Socket) {
    const senderId = client.data.userId;
    if (!senderId) {
      throw new UnauthorizedException('User ID is missing from WebSocket request');
    }

    console.log(`📨 User ${senderId} sending message to ${dto.receiverId}`);

    try {
      const message = await this.messagingService.sendMessage(senderId, dto);
      this.server.to(this.users.get(dto.receiverId) || '').emit('newMessage', message);
      return message;
    } catch (error) {
      console.error('❌ Error handling message:', error);
      return { error: (error as Error).message };
    }
  }
}
