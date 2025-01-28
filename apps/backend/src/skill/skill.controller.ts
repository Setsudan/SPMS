import { Controller, Get, Param } from '@nestjs/common';
import { SkillService } from './skill.service';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async getAllSkills() {
    return this.skillService.getAllSkills();
  }

  @Get(':name')
  async getSkillByName(@Param('name') name: string) {
    return this.skillService.getSkillByName(name);
  }
}
