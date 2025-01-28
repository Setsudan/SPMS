import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/messaging.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('send')
  sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    return this.messagingService.sendMessage(req.user.userId, dto);
  }

  @Get()
  getUserMessages(@Request() req) {
    return this.messagingService.getUserMessages(req.user.userId);
  }
}
