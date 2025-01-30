import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { SkillService } from "./skill.service";

describe("SkillService", () => {
  let service: SkillService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillService, PrismaService],
    }).compile();

    service = module.get<SkillService>(SkillService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("getAllSkills", () => {
    it("should return an array of skills", async () => {
      const skills = [
        { id: "1", name: "JavaScript", description: "Programming language" },
        {
          id: "2",
          name: "TypeScript",
          description: "Superset of JavaScript",
        },
      ];

      jest
        .spyOn(prismaService.client.skill, "findMany")
        .mockResolvedValue(skills);

      expect(await service.getAllSkills()).toBe(skills);
    });

    it("should return an empty array if no skills are found", async () => {
      jest.spyOn(prismaService.client.skill, "findMany").mockResolvedValue([]);

      expect(await service.getAllSkills()).toEqual([]);
    });
  });

  describe("getSkillByName", () => {
    it("should return a skill if found", async () => {
      const skill = {
        id: "1",
        name: "JavaScript",
        description: "Programming language",
      };

      jest
        .spyOn(prismaService.client.skill, "findUnique")
        .mockResolvedValue(skill);

      expect(await service.getSkillByName("JavaScript")).toBe(skill);
    });

    it("should throw NotFoundException if skill is not found", async () => {
      jest
        .spyOn(prismaService.client.skill, "findUnique")
        .mockResolvedValue(null);

      await expect(service.getSkillByName("NonExistentSkill")).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
