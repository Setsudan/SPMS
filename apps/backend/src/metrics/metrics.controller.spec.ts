import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

describe("MetricsController", () => {
  let metricsController: MetricsController;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            getMetrics: jest.fn().mockResolvedValue("metrics data"),
          },
        },
      ],
    }).compile();

    metricsController = module.get<MetricsController>(MetricsController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it("should be defined", () => {
    expect(metricsController).toBeDefined();
  });

  it("should return metrics data", async () => {
    const res = {
      set: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    await metricsController.getMetrics(res);

    expect(res.set).toHaveBeenCalledWith("Content-Type", "text/plain");
    expect(res.send).toHaveBeenCalledWith("metrics data");
    expect(metricsService.getMetrics).toHaveBeenCalled();
  });
});
