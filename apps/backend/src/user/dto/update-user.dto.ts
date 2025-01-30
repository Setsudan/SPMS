import { IsOptional, IsString, IsUrl, MaxLength, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsString()
  type!: string;

  @IsUrl()
  url!: string;
}

class SkillDto {
  @IsString()
  skillId!: string;

  @Min(0)
  @Max(5)
  ability!: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsUrl()
  face?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];
}
