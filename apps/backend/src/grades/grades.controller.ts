import { Controller, Get, Param } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  getAllGrades() {
    return this.gradesService.getAllGrades();
  }

  @Get(':id/students')
  getStudentsByGrade(@Param('id') gradeId: string) {
    return this.gradesService.getStudentsByGrade(gradeId);
  }
}
