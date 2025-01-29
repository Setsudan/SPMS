import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              user: {
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
              },
              grade: {
                findFirst: jest.fn(),
              },
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("signed-token"),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    it("should throw BadRequestException if user with the email already exists", async () => {
      const dto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password",
        gradeId: "grade-id-123",
      };

      (prismaService.client.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: dto.email,
      });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if grade is not found", async () => {
      const dto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password",
        gradeId: "grade-id-123",
      };

      (prismaService.client.user.findUnique as jest.Mock).mockResolvedValue(
        null
      );
      (prismaService.client.grade.findFirst as jest.Mock).mockResolvedValue(
        null
      );

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });

    it("should successfully register the user and return an access token", async () => {
      const dto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password",
        gradeId: "grade-id-123",
      };

      const existingGrade = { id: "grade-id-123", name: "Grade A" };
      const user = { id: "1", email: dto.email, password: "hashed-password" };

      (prismaService.client.user.findUnique as jest.Mock).mockResolvedValue(
        null
      );
      (prismaService.client.grade.findFirst as jest.Mock).mockResolvedValue(
        existingGrade
      );
      (prismaService.client.user.create as jest.Mock).mockResolvedValue(user);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

      const result = await service.register(dto);

      expect(result).toEqual({ access_token: "signed-token" });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });

  describe("login", () => {
    it("should throw UnauthorizedException for invalid credentials", async () => {
      const dto: LoginDto = {
        email: "test@example.com",
        password: "wrong-password",
      };

      const user = {
        id: "1",
        email: "test@example.com",
        password: "hashed-password",
      };

      (prismaService.client.user.findFirst as jest.Mock).mockResolvedValue(
        user
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if user is not found", async () => {
      const dto: LoginDto = {
        email: "test@example.com",
        password: "password",
      };

      (prismaService.client.user.findFirst as jest.Mock).mockResolvedValue(
        null
      );

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("should successfully login and return an access token", async () => {
      const dto: LoginDto = {
        email: "test@example.com",
        password: "password",
      };

      const user = {
        id: "1",
        email: "test@example.com",
        password: "hashed-password",
      };

      (prismaService.client.user.findFirst as jest.Mock).mockResolvedValue(
        user
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result).toEqual({ access_token: "signed-token" });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });
});
