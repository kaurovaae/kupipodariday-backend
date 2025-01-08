import { IsBoolean, IsDecimal, IsInt, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  user: number;

  @IsInt()
  item: number;

  @IsDecimal({ decimal_digits: '2' })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
