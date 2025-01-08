import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateWishListDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  description: string;

  @IsString()
  image: string;

  @IsArray()
  items: number[];
}
