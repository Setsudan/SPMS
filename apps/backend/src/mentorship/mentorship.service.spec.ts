import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { MentorshipService } from "./mentorship.service";

describe("MentorshipService", () => {
  let service: MentorshipService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorshipService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              user: {
                findUnique: jest.fn(),
              },
              request: {
                create: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
              },
              mentorship: {
                create: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<MentorshipService>(MentorshipService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("requestMentorship", () => {
    it("should throw NotFoundException if receiver is not found", async () => {
      jest
        .spyOn(prismaService.client.user, "findUnique")
        .mockResolvedValue(null);

      const dto = { receiverId: "non-existing-mentor" };
      await expect(service.requestMentorship("user-id", dto)).rejects.toThrow(
        new NotFoundException("Mentor not found")
      );
    });

    it("should create mentorship request if receiver is found", async () => {
      const mockReceiver = {
        id: "receiver-id",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashed-password",
        face: null,
        bio: null,
        gradeId: "receiver-grade-id",
        createdAt: new Date(),
        grade: { id: "receiver-grade-id", name: "Senior" },
      };

      const mockSender = {
        id: "user-id",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "hashed-password",
        face: null,
        bio: null,
        gradeId: "sender-grade-id",
        createdAt: new Date(),
        grade: { id: "sender-grade-id", name: "Junior" },
      };

      jest
        .spyOn(prismaService.client.user, "findUnique")
        .mockResolvedValueOnce(mockReceiver)
        .mockResolvedValueOnce(mockSender);

      const dto = { receiverId: "receiver-id" };
      jest.spyOn(prismaService.client.request, "create").mockResolvedValue({
        id: "request-id",
        createdAt: new Date(),
        senderId: "user-id", // Correct senderId to match the actual one
        receiverId: "receiver-id",
        status: "pending",
        message: null,
      });

      const result = await service.requestMentorship("user-id", dto);

      expect(result).toEqual({
        id: "request-id",
        createdAt: expect.any(Date),
        senderId: "user-id", // Updated to "user-id"
        receiverId: "receiver-id",
        status: "pending",
        message: null,
      });

      expect(prismaService.client.request.create).toHaveBeenCalledWith({
        data: {
          senderId: "user-id", // Also updated here to match the actual senderId
          receiverId: "receiver-id",
          status: "pending",
        },
      });
    });
  });

  describe("acceptMentorship", () => {
    it("should throw NotFoundException if request is not found", async () => {
      jest
        .spyOn(prismaService.client.request, "findUnique")
        .mockResolvedValue(null);

      const dto = { requestId: "non-existing-request" };
      await expect(service.acceptMentorship("user-id", dto)).rejects.toThrow(
        new NotFoundException("Request not found")
      );
    });

    it("should throw ForbiddenException if user is not authorized to accept the request", async () => {
      const mockRequest = {
        id: "request-id",
        receiverId: "wrong-user-id",
        senderId: "sender-id",
      };
      jest.spyOn(prismaService.client.request, "findUnique").mockResolvedValue({
        ...mockRequest,
        createdAt: new Date(),
        status: "pending",
        message: null,
      });

      const dto = { requestId: "request-id" };
      await expect(service.acceptMentorship("user-id", dto)).rejects.toThrow(
        new ForbiddenException("Unauthorized")
      );
    });

    it("should create mentorship and update request status if request is accepted", async () => {
      const mockRequest = {
        id: "request-id",
        receiverId: "user-id",
        senderId: "sender-id",
      };
      jest.spyOn(prismaService.client.request, "findUnique").mockResolvedValue({
        ...mockRequest,
        createdAt: new Date(),
        status: "pending",
        message: null,
      });
      jest.spyOn(prismaService.client.mentorship, "create").mockResolvedValue({
        id: "mentorship-id",
        seniorId: "user-id",
        juniorId: "sender-id",
      });
      jest.spyOn(prismaService.client.request, "update").mockResolvedValue({
        id: "request-id",
        createdAt: new Date(),
        senderId: "sender-id",
        receiverId: "receiver-id",
        status: "accepted",
        message: null,
      });

      const dto = { requestId: "request-id" };

      const result = await service.acceptMentorship("user-id", dto);

      expect(result).toEqual({
        id: "request-id",
        status: "accepted",
        createdAt: expect.any(Date),
        senderId: "sender-id",
        receiverId: "receiver-id",
        message: null,
      });

      expect(prismaService.client.mentorship.create).toHaveBeenCalledWith({
        data: {
          seniorId: "user-id",
          juniorId: "sender-id",
        },
      });
      expect(prismaService.client.request.update).toHaveBeenCalledWith({
        where: { id: "request-id" },
        data: { status: "accepted" },
      });
    });
  });
});
