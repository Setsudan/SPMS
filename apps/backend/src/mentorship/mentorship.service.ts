import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MentorshipRequestDto, AcceptMentorshipDto } from './dto/mentorship.dto';

@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async requestMentorship(userId: string, dto: MentorshipRequestDto) {
    // Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId },
    });
    if (!receiver) throw new NotFoundException('Mentor not found');

    // Create mentorship request
    return await this.prisma.request.create({
      data: {
        senderId: userId,
        receiverId: dto.receiverId,
        status: 'pending',
      },
    });
  }

  async acceptMentorship(userId: string, dto: AcceptMentorshipDto) {
    const request = await this.prisma.request.findUnique({
      where: { id: dto.requestId },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.receiverId !== userId) throw new ForbiddenException('Unauthorized');

    // Create mentorship relationship
    await this.prisma.mentorship.create({
      data: {
        seniorId: userId,
        juniorId: request.senderId,
      },
    });

    // Update request status
    return await this.prisma.request.update({
      where: { id: dto.requestId },
      data: { status: 'accepted' },
    });
  }
}
