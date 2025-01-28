import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.client.user.findUnique({
      where: { id: userId }, // ✅ Ensure `id` is passed
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        face: true,
        socialLinks: true,
        grade: {
          select: {
            name: true,
            graduationYear: true,
          },
        },
      },
    });
  }
}
