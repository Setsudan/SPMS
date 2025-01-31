import { Test, TestingModule } from "@nestjs/testing";
import * as promClient from "prom-client";
import { MetricsService } from "./metrics.service";

jest.mock("prom-client", () => ({
  collectDefaultMetrics: jest.fn(),
  register: {
    metrics: jest.fn(),
  },
}));

describe("MetricsService", () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should collect default metrics on module init", () => {
    service.onModuleInit();
    expect(promClient.collectDefaultMetrics).toHaveBeenCalled();
  });

  it("should return metrics", async () => {
    const metrics = "some metrics";
    (promClient.register.metrics as jest.Mock).mockResolvedValue(metrics);

    const result = await service.getMetrics();
    expect(result).toBe(metrics);
  });
});
