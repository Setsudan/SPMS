import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SeedersModule } from './seeders/seeders.module';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [SeedersModule],
})
export class PrismaModule {}
