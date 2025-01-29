import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { MessagingService } from "./messaging.service";

describe("MessagingService", () => {
  let service: MessagingService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              message: {
                findMany: jest.fn(),
                create: jest.fn(),
              },
              user: {
                findUnique: jest.fn(),
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("getUserMessages", () => {
    it("should return messages for a given user", async () => {
      const mockMessages = [
        {
          id: "1",
          senderId: "user-id",
          receiverId: "receiver-id",
          content: "Hello",
          timestamp: new Date(),
        },
        {
          id: "2",
          senderId: "receiver-id",
          receiverId: "user-id",
          content: "Hi",
          timestamp: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.client.message, "findMany")
        .mockResolvedValue(mockMessages);

      const result = await service.getUserMessages("user-id");

      expect(result).toEqual(mockMessages);
      expect(prismaService.client.message.findMany).toHaveBeenCalledWith({
        where: { OR: [{ senderId: "user-id" }, { receiverId: "user-id" }] },
        orderBy: { timestamp: "asc" },
      });
    });

    it("should return an empty array when there are no messages for a given user", async () => {
      jest
        .spyOn(prismaService.client.message, "findMany")
        .mockResolvedValue([]);

      const result = await service.getUserMessages("user-id");

      expect(result).toEqual([]);
      expect(prismaService.client.message.findMany).toHaveBeenCalledWith({
        where: { OR: [{ senderId: "user-id" }, { receiverId: "user-id" }] },
        orderBy: { timestamp: "asc" },
      });
    });
  });

  describe("sendMessage", () => {
    it("should send a message successfully", async () => {
      const mockMessage = {
        id: "1",
        senderId: "user-id",
        receiverId: "receiver-id",
        content: "Hello",
        timestamp: new Date(),
      };

      const mockReceiver = {
        id: "receiver-id",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashed-password",
        face: null,
        bio: null,
        gradeId: null,
        createdAt: new Date(),
      };

      jest
        .spyOn(prismaService.client.user, "findUnique")
        .mockResolvedValue(mockReceiver);

      jest
        .spyOn(prismaService.client.message, "create")
        .mockResolvedValue(mockMessage);

      const dto = { receiverId: "receiver-id", content: "Hello" };
      const result = await service.sendMessage("user-id", dto);

      expect(result).toEqual(mockMessage);
      expect(prismaService.client.user.findUnique).toHaveBeenCalledWith({
        where: { id: "receiver-id" },
      });
      expect(prismaService.client.message.create).toHaveBeenCalledWith({
        data: {
          senderId: "user-id",
          receiverId: "receiver-id",
          content: "Hello",
        },
      });
    });

    it("should throw NotFoundException if receiver does not exist", async () => {
      jest
        .spyOn(prismaService.client.user, "findUnique")
        .mockResolvedValue(null);

      const dto = { receiverId: "non-existent-id", content: "Hello" };

      await expect(service.sendMessage("user-id", dto)).rejects.toThrow(
        NotFoundException
      );

      expect(prismaService.client.user.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
      expect(prismaService.client.message.create).not.toHaveBeenCalled();
    });
  });
});
