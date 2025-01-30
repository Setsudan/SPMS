import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MentorshipService } from './mentorship.service';
import { MentorshipRequestDto, AcceptMentorshipDto } from './dto/mentorship.dto';
import { RequestWithUser } from '../types/request-with-user';

@UseGuards(AuthGuard('jwt'))
@Controller('mentorship')
export class MentorshipController {
  constructor(private mentorshipService: MentorshipService) {}

  @Post('request')
  async requestMentorship(@Req() req: RequestWithUser, @Body() dto: MentorshipRequestDto) {
    return this.mentorshipService.requestMentorship(req.user.id, dto);
  }

  @Post('accept')
  async acceptMentorship(@Req() req: RequestWithUser, @Body() dto: AcceptMentorshipDto) {
    return this.mentorshipService.acceptMentorship(req.user.id, dto);
  }

  @Get('available')
  async getAvailableMentors(@Req() req: RequestWithUser) {
    return this.mentorshipService.getAvailableMentors(req.user.id);
  }
}
