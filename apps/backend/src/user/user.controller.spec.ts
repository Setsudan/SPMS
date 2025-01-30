import { ForbiddenException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequestWithUser } from "../types/request-with-user";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserProfile: jest.fn(),
            updateProfile: jest.fn(),
            addSkillToUser: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const req = { user: { id: "1" } } as RequestWithUser;
      const userProfile = {
        id: "receiver-id",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        face: null,
        bio: null,
        grade: null,
        skills: [],
        socialLinks: [],
      };
      jest.spyOn(userService, "getUserProfile").mockResolvedValue(userProfile);

      expect(await controller.getProfile(req)).toBe(userProfile);
    });

    it("should throw ForbiddenException if user ID is missing", async () => {
      const req = { user: {} } as RequestWithUser;

      await expect(controller.getProfile(req)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const req = { user: { id: "1" } } as RequestWithUser;
      const dto = {
        bio: "This is a bio",
        face: "image-url",
        socialLinks: [
          {
            type: "LinkedIn",
            url: "https://linkedin.com/in/johndoe",
          },
        ],
        skills: [
          {
            skillId: "1",
            ability: 5,
          },
        ],
      };

      const updatedProfile = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        bio: "This is a bio",
        face: "image-url",
        skills: [
          {
            skillId: "1",
            skill: {
              name: "JavaScript",
            },
            ability: 5,
          },
        ],
        socialLinks: [
          {
            id: "1",
            userId: "1",
            type: "LinkedIn",
            url: "https://linkedin.com/in/johndoe",
          },
        ],
      };

      jest
        .spyOn(userService, "updateProfile")
        .mockResolvedValue(updatedProfile);

      expect(await controller.updateProfile(req, dto)).toBe(updatedProfile);
    });

    it("should throw ForbiddenException if user ID is missing", async () => {
      const req = { user: {} } as RequestWithUser;
      const dto = {
        bio: "Updated bio",
        face: "updated-image-url",
        socialLinks: [],
        skills: [],
      };

      await expect(controller.updateProfile(req, dto)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe("getUserById", () => {
    it("should return user profile by ID", async () => {
      const userId = "1";
      const userProfile = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        face: null,
        bio: null,
        grade: null,
        skills: [],
        socialLinks: [],
      };
      jest.spyOn(userService, "getUserProfile").mockResolvedValue(userProfile);

      expect(await controller.getUserById(userId)).toBe(userProfile);
    });
  });

  describe("addSkillToUser", () => {
    it("should add skill to user", async () => {
      const req = { user: { id: "1" } } as RequestWithUser;
      const body = { skillId: "1", ability: 5 };
      const result = {
        id: "1",
        studentId: "1",
        skillId: "1",
        ability: 5,
        peerScore: null,
      };
      jest.spyOn(userService, "addSkillToUser").mockResolvedValue(result);

      expect(await controller.addSkillToUser(req, body)).toBe(result);
    });

    it("should throw error if user ID is missing", async () => {
      const req = { user: {} } as RequestWithUser;
      const body = { skillId: "1", ability: 5 };

      await expect(controller.addSkillToUser(req, body)).rejects.toThrow(Error);
    });
  });
});
