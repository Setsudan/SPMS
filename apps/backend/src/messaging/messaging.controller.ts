import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req, UnauthorizedException, Logger } from '@nestjs/common';
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

    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User ID is missing from request');
    }

    return this.messagingService.sendMessage(req.user.id, dto);
  }

  @Get()
  async getUserMessages(@Req() req: RequestWithUser) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    return this.messagingService.getUserMessages(req.user.id);
  }

  @Patch(':id/read')
  async markMessageAsRead(@Req() req: RequestWithUser, @Param('id') messageId: string) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    return this.messagingService.markMessageAsRead(req.user.id, messageId);
  }
}
