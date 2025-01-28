import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSkills() {
    return this.prisma.client.skill.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async getSkillByName(name: string) {
    const skill = await this.prisma.client.skill.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }
}
