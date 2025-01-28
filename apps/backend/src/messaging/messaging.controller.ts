import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagingService } from './messaging.service';
import { SendMessageDto } from './dto/messaging.dto';
import { RequestWithUser } from '../types/request-with-user';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('send')
  async sendMessage(@Req() req: RequestWithUser, @Body() dto: SendMessageDto) {
    if (req.user) {
      return this.messagingService.sendMessage(req.user.id, dto);
    }
    throw new Error('User not authenticated');
  }

  @Get()
  async getUserMessages(@Req() req: RequestWithUser) {
    if (req.user) {
      return this.messagingService.getUserMessages(req.user.id);
    }
    throw new Error('User not authenticated');
  }
}
