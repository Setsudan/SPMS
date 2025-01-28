import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

 async register(dto: RegisterDto): Promise<{ access_token: string }> {
  const existingGrade = await this.prisma.client.grade.findUnique({
    where: { id: dto.gradeId },
  });

  if (!existingGrade) {
    throw new Error('Grade not found');
  }

  const user = await this.prisma.client.user.create({
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      gradeId: dto.gradeId,
    },
  });

  return this.generateToken(user);
  }


  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.client.user.findFirst({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: { id: string; email: string }): { access_token: string } {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
