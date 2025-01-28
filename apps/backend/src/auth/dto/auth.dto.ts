import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'StrongPassword123' })
  password!: string;

  @ApiProperty({ example: 'grade-id-123' }) // Updated field
  gradeId!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'StrongPassword123' })
  password!: string;
}
