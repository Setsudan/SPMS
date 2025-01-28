"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGrades = seedGrades;
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const prisma = new client_1.PrismaClient();
const logger = new common_1.Logger('DatabaseSeeder');
function seedGrades() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear();
        const grades = [
            { name: 'Programme Grande École', year: 5 },
            { name: 'Bachelor Développeur Web', year: 3 },
            { name: 'Bachelor Data & IA', year: 3 },
            { name: 'Bachelor Webmarketing & UX', year: 3 },
            { name: 'Prépa Mastère Digital', year: 2 },
            { name: 'Mastère Data & IA', year: 2 },
            { name: 'Mastère Marketing Digital & UX', year: 2 },
            { name: 'Mastère CTO & Tech Lead', year: 2 },
            { name: 'Mastère Product Manager', year: 2 },
            { name: 'Mastère Cybersécurité', year: 2 },
        ];
        for (const grade of grades) {
            for (let i = 0; i <= grade.year; i++) {
                const graduationYear = `P${currentYear + i}`;
                const gradeNameWithYear = `${grade.name} - ${graduationYear}`;
                const existingGrade = yield prisma.grade.findFirst({
                    where: { name: gradeNameWithYear },
                });
                if (!existingGrade) {
                    yield prisma.grade.create({ data: Object.assign(Object.assign({}, grade), { name: gradeNameWithYear, graduationYear }) });
                    logger.log(`Inserted grade: ${gradeNameWithYear}`);
                }
                else {
                    logger.log(`Grade already exists: ${gradeNameWithYear}`);
                }
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield seedGrades();
            logger.log('Database seeding completed.');
        }
        catch (error) {
            logger.error('Error seeding database:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main();
