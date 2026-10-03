import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../common/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
