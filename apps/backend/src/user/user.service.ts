import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

 async updateProfile(userId: string, dto: UpdateUserDto) {
  const restrictedFields = ['firstName', 'lastName', 'email', 'gradeId', 'password'];
  const attemptedKeys = Object.keys(dto);
  const invalidFields = attemptedKeys.filter(key => restrictedFields.includes(key));

  if (invalidFields.length) {
    throw new ForbiddenException(`You cannot update: ${invalidFields.join(', ')}`);
  }

  return this.prisma.client.user.update({
    where: { id: userId },
    data: {
      bio: dto.bio ?? undefined,
      face: dto.face ?? undefined,
      socialLinks: dto.socialLinks
        ? {
            deleteMany: {},
            create: dto.socialLinks.map(link => ({
              type: link.type,
              url: link.url,
            })),
          }
        : undefined,
      skills: dto.skills
        ? {
            upsert: dto.skills.map(skill => ({
              where: { studentId_skillId: { studentId: userId, skillId: skill.skillId } },
              update: { ability: skill.ability },
              create: { skillId: skill.skillId, ability: skill.ability },
            })),
          }
        : undefined,
    },
    select: {
      id: true,
      bio: true,
      face: true,
      socialLinks: true,
      skills: {
        select: {
          skill: { select: { name: true, id: true } },
          ability: true,
        },
      },
    },
  });
}


  async getUserProfile(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        face: true,
        grade: { select: { name: true, graduationYear: true, id: true } },
        socialLinks: true,
        skills: {
          select: {
            skill: { select: { name: true, id: true } },
            ability: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addSkillToUser(userId: string, skillId: string, ability: number) {
    // Check if the skill exists
    const skill = await this.prisma.client.skill.findUnique({ where: { id: skillId } });
    if (!skill) throw new NotFoundException('Skill not found');

    // Upsert skill for user (update if exists, create if not)
    return this.prisma.client.studentSkill.upsert({
      where: {
        studentId_skillId: { studentId: userId, skillId },
      },
      update: { ability },
      create: { studentId: userId, skillId, ability },
    });
  }
}
