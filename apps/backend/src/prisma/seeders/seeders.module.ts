import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GradesSeeder } from './grades/grades.service';
import { SkillsSeeder } from './skills/skills.service';

@Module({
  providers: [PrismaService, GradesSeeder, SkillsSeeder],
  exports: [GradesSeeder, SkillsSeeder],
})
export class SeedersModule {}
