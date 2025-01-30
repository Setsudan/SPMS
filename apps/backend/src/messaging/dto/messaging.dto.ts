import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverId!: string;

  @IsString()
  @Length(1, 1000)
  content!: string;
}
