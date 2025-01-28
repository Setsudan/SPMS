import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/messaging.dto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, dto: SendMessageDto) {
    // Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId },
    });
    if (!receiver) throw new NotFoundException('User not found');

    return await this.prisma.message.create({
      data: {
        senderId: userId,
        receiverId: dto.receiverId,
        content: dto.content,
      },
    });
  }

  async getUserMessages(userId: string) {
    return await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { timestamp: 'asc' },
    });
  }
}
