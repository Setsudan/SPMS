import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest
              .fn()
              .mockResolvedValue({ access_token: "mockAccessToken" }),
            login: jest
              .fn()
              .mockResolvedValue({ access_token: "mockAccessToken" }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("register", () => {
    it("should call authService.register and return an access token", async () => {
      const registerDto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "StrongPassword123",
        gradeId: "grade-id-123",
      };

      const result = await authController.register(registerDto);

      expect(result).toEqual({ access_token: "mockAccessToken" });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe("login", () => {
    it("should call authService.login and return an access token", async () => {
      const loginDto: LoginDto = {
        email: "john.doe@example.com",
        password: "StrongPassword123",
      };

      const result = await authController.login(loginDto);

      expect(result).toEqual({ access_token: "mockAccessToken" });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});
