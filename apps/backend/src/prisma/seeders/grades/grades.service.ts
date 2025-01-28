import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class GradesSeeder {
  private readonly logger = new Logger(GradesSeeder.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const currentYear = new Date().getFullYear();

    const grades = [
        { name: 'Programme Grande École', year: 5 },
        { name: 'Bachelor Développeur Web', year: 3 },
        { name: 'Bachelor Data & IA', year: 3 },
        { name: 'Bachelor Webmarketing & UX', year: 3 },
        { name: 'Prépa Mastère Digital', year: 2 },
        { name: 'Mastère Data & IA', year: 2 },
        { name: 'Mastère Marketing Digital & UX', year: 2 },
        { name: 'Mastère CTO & Tech Lead', year: 2 },
        { name: 'Mastère Product Manager', year: 2 },
        { name: 'Mastère Cybersécurité', year: 2 },
    ];

    for (const grade of grades) {
      for (let i = 0; i < grade.year; i++) {
        const graduationYear = `P${currentYear + i}`;
        await this.prisma.client.grade.upsert({
          where: { id: `${grade.name}-${graduationYear}` },
          update: {},
          create: { id: `${grade.name}-${graduationYear}`, name: grade.name, year: grade.year, graduationYear },
        });
        this.logger.log(`Inserted grade: ${grade.name} - ${graduationYear}`);
      }
    }
  }
}
