import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MentorshipService } from './mentorship.service';
import { MentorshipRequestDto, AcceptMentorshipDto } from './dto/mentorship.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('mentorship')
export class MentorshipController {
  constructor(private mentorshipService: MentorshipService) {}

  @Post('request')
  requestMentorship(@Request() req, @Body() dto: MentorshipRequestDto) {
    return this.mentorshipService.requestMentorship(req.user.userId, dto);
  }

  @Post('accept')
  acceptMentorship(@Request() req, @Body() dto: AcceptMentorshipDto) {
    return this.mentorshipService.acceptMentorship(req.user.userId, dto);
  }
}
