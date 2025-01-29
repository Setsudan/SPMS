import { AuthGuard } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { RequestWithUser } from "../types/request-with-user";
import { SendMessageDto } from "./dto/messaging.dto";
import { MessagingController } from "./messaging.controller";
import { MessagingService } from "./messaging.service";

describe("MessagingController", () => {
  let controller: MessagingController;
  let messagingService: MessagingService;

  const mockMessagingService = {
    sendMessage: jest.fn(),
    getUserMessages: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagingController],
      providers: [
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
      ],
    })
      .overrideGuard(AuthGuard("jwt"))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<MessagingController>(MessagingController);
    messagingService = module.get<MessagingService>(MessagingService);
  });

  describe("sendMessage", () => {
    it("should call sendMessage service method when user is authenticated", async () => {
      const req = { user: { id: "user-id" } } as RequestWithUser;
      const dto: SendMessageDto = {
        content: "Hello",
        receiverId: "receiver-id",
      };

      await controller.sendMessage(req, dto);

      expect(messagingService.sendMessage).toHaveBeenCalledWith("user-id", dto);
    });

    it("should throw an error when user is not authenticated", async () => {
      const req = {} as RequestWithUser;
      const dto: SendMessageDto = {
        content: "Hello",
        receiverId: "receiver-id",
      };

      await expect(controller.sendMessage(req, dto)).rejects.toThrow(
        "User not authenticated"
      );
    });
  });

  describe("getUserMessages", () => {
    it("should call getUserMessages service method when user is authenticated", async () => {
      const req = { user: { id: "user-id" } } as RequestWithUser;

      await controller.getUserMessages(req);

      expect(messagingService.getUserMessages).toHaveBeenCalledWith("user-id");
    });

    it("should throw an error when user is not authenticated", async () => {
      const req = {} as RequestWithUser;

      await expect(controller.getUserMessages(req)).rejects.toThrow(
        "User not authenticated"
      );
    });
  });
});
