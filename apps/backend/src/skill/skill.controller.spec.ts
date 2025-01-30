import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SkillController } from "./skill.controller";
import { SkillService } from "./skill.service";

describe("SkillController", () => {
  let controller: SkillController;
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [
        {
          provide: SkillService,
          useValue: {
            getAllSkills: jest.fn(),
            getSkillByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SkillController>(SkillController);
    service = module.get<SkillService>(SkillService);
  });

  describe("getAllSkills", () => {
    it("should return an array of skills", async () => {
      const skills = [
        { id: "1", name: "JavaScript", description: "Programming language" },
        { id: "2", name: "TypeScript", description: "Superset of JavaScript" },
      ];

      jest.spyOn(service, "getAllSkills").mockResolvedValue(skills);

      const result = await controller.getAllSkills();
      expect(result).toEqual(skills); // Vérifier que le résultat est la liste des compétences
    });
  });

  describe("getSkillByName", () => {
    it("should return a skill if found", async () => {
      const skill = {
        id: "1",
        name: "JavaScript",
        description: "Programming language",
      };

      jest.spyOn(service, "getSkillByName").mockResolvedValue(skill);

      const result = await controller.getSkillByName("JavaScript");
      expect(result).toEqual(skill);
    });

    it("should throw NotFoundException if skill is not found", async () => {
      jest
        .spyOn(service, "getSkillByName")
        .mockRejectedValue(new NotFoundException("Skill not found"));

      await expect(
        controller.getSkillByName("NonExistentSkill")
      ).rejects.toThrowError(new NotFoundException("Skill not found"));
    });
  });
});
