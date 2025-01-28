import { Request } from 'express';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
