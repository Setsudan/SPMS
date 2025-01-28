import { IsOptional, IsString, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsString()
  type!: string; // Required field

  @IsString()
  url!: string; // Required field
}

class SkillUpdateDto {
  @IsString()
  skillId!: string; // Required field

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ability?: number; // Ensure ability is between 1-5
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  face?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillUpdateDto)
  skills?: SkillUpdateDto[];
}
