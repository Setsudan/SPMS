import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { GradesService } from "./grades.service";

describe("GradesService", () => {
  let gradesService: GradesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              grade: {
                findMany: jest
                  .fn()
                  .mockResolvedValue([
                    { id: "1", name: "Grade 1", graduationYear: 2025 },
                  ]),
              },
              user: {
                findMany: jest.fn().mockImplementation(({ where }) =>
                  where.gradeId === "1"
                    ? [
                        {
                          id: "101",
                          firstName: "John",
                          lastName: "Doe",
                          email: "john@example.com",
                          bio: "Student bio",
                          face: "face-image-url",
                        },
                      ]
                    : []
                ),
              },
            },
          },
        },
      ],
    }).compile();

    gradesService = module.get<GradesService>(GradesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should return all grades", async () => {
    const result = await gradesService.getAllGrades();
    expect(result).toEqual([
      { id: "1", name: "Grade 1", graduationYear: 2025 },
    ]);
    expect(prismaService.client.grade.findMany).toHaveBeenCalled();
  });

  it("should return students by grade", async () => {
    const result = await gradesService.getStudentsByGrade("1");
    expect(result).toEqual([
      {
        id: "101",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        bio: "Student bio",
        face: "face-image-url",
      },
    ]);

    expect(prismaService.client.user.findMany).toHaveBeenCalledWith({
      where: { gradeId: "1" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        face: true,
      },
    });
  });

  it("should return empty array if no students in grade", async () => {
    const result = await gradesService.getStudentsByGrade("9999999");
    expect(result).toEqual([]);
    expect(prismaService.client.user.findMany).toHaveBeenCalledWith({
      where: { gradeId: "9999999" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        face: true,
      },
    });
  });
});
