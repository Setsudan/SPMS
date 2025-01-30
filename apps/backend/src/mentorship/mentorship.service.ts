import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MentorshipRequestDto, AcceptMentorshipDto } from './dto/mentorship.dto';

@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async requestMentorship(userId: string, dto: MentorshipRequestDto) {
    // Fetch both users with their grades
    const sender = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: { grade: true },
    });

    const receiver = await this.prisma.client.user.findUnique({
      where: { id: dto.receiverId },
      include: { grade: true },
    });

    if (!receiver) throw new NotFoundException('Mentor not found');
    if (!sender) throw new NotFoundException('User not found');
    if (!sender.grade) throw new NotFoundException('Your grade information is missing');
    if (!receiver.grade) throw new NotFoundException('Mentor grade information is missing');

    // Ensure receiver is a senior (has an earlier graduation year)
    if (sender.grade.graduationYear <= receiver.grade.graduationYear) {
      throw new ForbiddenException('You can only request mentorship from a senior');
    }

    // Create mentorship request
    return await this.prisma.client.request.create({
      data: {
        senderId: userId,
        receiverId: dto.receiverId,
        status: 'pending',
      },
    });
  }


  async acceptMentorship(userId: string, dto: AcceptMentorshipDto) {
    const request = await this.prisma.client.request.findUnique({
      where: { id: dto.requestId },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.receiverId !== userId) throw new ForbiddenException('Unauthorized');

    // Create mentorship relationship
    await this.prisma.client.mentorship.create({
      data: {
        seniorId: userId,
        juniorId: request.senderId,
      },
    });

    // Update request status
    return await this.prisma.client.request.update({
      where: { id: dto.requestId },
      data: { status: 'accepted' },
    });
  }

  async getAvailableMentors(userId: string) {
  // Get the user's grade & graduation year
  const user = await this.prisma.client.user.findUnique({
    where: { id: userId },
    include: { grade: true },
  });

  if (!user || !user.grade) throw new NotFoundException('User grade not found');

  // Get senior students (graduationYear < user's graduationYear)
  return this.prisma.client.user.findMany({
    where: {
      grade: { graduationYear: { lt: user.grade.graduationYear } }, // Only seniors
      id: { not: userId }, // Exclude the requester
    },
    include: { grade: true },
  });
}

}
