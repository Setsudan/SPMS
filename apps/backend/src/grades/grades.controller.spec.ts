import { Test, TestingModule } from "@nestjs/testing";
import { GradesController } from "./grades.controller";
import { GradesService } from "./grades.service";

describe("GradesController", () => {
  let gradesController: GradesController;
  let gradesService: GradesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradesController],
      providers: [
        {
          provide: GradesService,
          useValue: {
            getAllGrades: jest.fn().mockReturnValue(["Grade 1", "Grade 2"]),
            getStudentsByGrade: jest
              .fn()
              .mockImplementation((id) => [`Student for grade ${id}`]),
          },
        },
      ],
    }).compile();

    gradesController = module.get<GradesController>(GradesController);
    gradesService = module.get<GradesService>(GradesService);
  });

  it("should be defined", () => {
    expect(gradesController).toBeDefined();
  });

  it("should return all grades", async () => {
    expect(await gradesController.getAllGrades()).toEqual([
      "Grade 1",
      "Grade 2",
    ]);
    expect(gradesService.getAllGrades).toHaveBeenCalled();
  });

  it("should return students for a specific grade", async () => {
    const gradeId = "1";
    expect(await gradesController.getStudentsByGrade(gradeId)).toEqual([
      `Student for grade ${gradeId}`,
    ]);
    expect(gradesService.getStudentsByGrade).toHaveBeenCalledWith(gradeId);
  });
});
