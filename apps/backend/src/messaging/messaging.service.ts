import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/messaging.dto';
import { MessagingGateway } from './messaging.gateway';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService, private gateway: MessagingGateway) { }
  
  async sendMessage(userId: string, dto: SendMessageDto) {
    if (!userId) {
      throw new Error('User ID is missing when sending a message');
    }

    return await this.prisma.client.$transaction(async (prisma) => {
      // Check if receiver exists
      const receiver = await prisma.user.findUnique({
        where: { id: dto.receiverId },
      });

      if (!receiver) throw new NotFoundException('User not found');

      console.log(`Creating message from ${userId} to ${dto.receiverId}`);

      return await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: dto.receiverId,
          content: dto.content,
        },
      });
    });
  }

    async getUserMessages(userId: string, page = 1, pageSize = 20) {
      return await this.prisma.client.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { timestamp: 'asc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });
    }

  async markMessageAsRead(userId: string, messageId: string) {
    return await this.prisma.client.$transaction(async (prisma) => {
      // Check if the message exists and is owned by the receiver
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) throw new NotFoundException('Message not found');
      if (message.receiverId !== userId) throw new ForbiddenException('You can only mark your own received messages as read');

      return await prisma.message.update({
        where: { id: messageId },
        data: { read: true },
      });
    });
  }
}
