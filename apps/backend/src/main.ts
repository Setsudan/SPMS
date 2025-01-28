import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GradesSeeder } from './prisma/seeders/grades/grades.service';
import { SkillsSeeder } from './prisma/seeders/skills/skills.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Student Program API')
    .setDescription('API documentation for student collaboration platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get seeders and execute them
  const gradesSeeder = app.get(GradesSeeder);
  const skillsSeeder = app.get(SkillsSeeder);
  
  await gradesSeeder.seed();
  await skillsSeeder.seed();

  await app.listen(5000);
}

bootstrap();
