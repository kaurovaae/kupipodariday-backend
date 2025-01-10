import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
