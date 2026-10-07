import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  inviteCode?: string;
}
