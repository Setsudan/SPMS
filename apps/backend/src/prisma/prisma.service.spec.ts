import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "./prisma.service";

// Mock du PrismaClient
jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    client: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("PrismaService", () => {
  let service: PrismaService;
  let prismaClientMock: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    prismaClientMock = service.client;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should connect to the database on module init", async () => {
    await service.onModuleInit();
    expect(prismaClientMock.$connect).toHaveBeenCalled();
  });

  it("should disconnect from the database on module destroy", async () => {
    await service.onModuleDestroy();
    expect(prismaClientMock.$disconnect).toHaveBeenCalled();
  });

  it("should return the PrismaClient instance", () => {
    expect(service.client).toBe(prismaClientMock);
  });
});
