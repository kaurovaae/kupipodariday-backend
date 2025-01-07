import {
  IsDecimal,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsDecimal({ decimal_digits: '2' })
  raised: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
