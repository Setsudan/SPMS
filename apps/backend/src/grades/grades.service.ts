import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllGrades() {
    return this.prisma.client.grade.findMany({
      select: { id: true, name: true, graduationYear: true },
    });
  }

  async getStudentsByGrade(gradeId: string) {
    return this.prisma.client.user.findMany({
      where: { gradeId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }
}
