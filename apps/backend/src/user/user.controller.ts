import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Post,
  Req,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../types/request-with-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    if (!req.user?.id) {
      throw new ForbiddenException('User ID is missing from request');
    }
    return this.userService.getUserProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    if (!req.user?.id) {
      throw new ForbiddenException('User ID is missing from request');
    }
    return this.userService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

   @UseGuards(JwtAuthGuard)
  @Get('grade')
  async getGrade(@Req() req: RequestWithUser) { // Get the authenticated user's grade
    const userId = req.user?.id;
    Logger.log(`Getting grade for user ${userId}`);
    if (!userId) throw new Error('User ID missing from request');

    return this.userService.getGrade(userId);
  }

  // Skills
  @UseGuards(JwtAuthGuard)
  @Post('skills')
  async addSkillToUser(@Req() req: RequestWithUser, @Body() body: { skillId: string; ability: number }) {
    const userId = req.user?.id;
    if (!userId) throw new Error('User ID missing from request');

    return this.userService.addSkillToUser(userId, body.skillId, body.ability);
  }

 
}
