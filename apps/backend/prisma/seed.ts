import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeeder');

export async function seedGrades() {
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
    for (let i = 0; i <= grade.year; i++) {
        const graduationYear = `P${currentYear + i}`;
        const gradeNameWithYear = `${grade.name} - ${graduationYear}`;
        const existingGrade = await prisma.grade.findFirst({
            where: { name: gradeNameWithYear },
        });

        if (!existingGrade) {
            await prisma.grade.create({ data: { ...grade, name: gradeNameWithYear, graduationYear } });
            logger.log(`Inserted grade: ${gradeNameWithYear}`);
        } else {
            logger.log(`Grade already exists: ${gradeNameWithYear}`);
        }
    }
}
}

async function main() {
  try {
    await seedGrades();
    logger.log('Database seeding completed.');
  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();