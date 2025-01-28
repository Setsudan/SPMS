import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MentorshipModule } from './mentorship/mentorship.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MentorshipModule,
    MessagingModule,
  ],
})
export class AppModule { }
