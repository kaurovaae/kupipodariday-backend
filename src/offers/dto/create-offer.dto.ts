import { IsBoolean, IsDecimal, IsInt, IsOptional } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

export class CreateOfferDto {
  @IsInt()
  user: User;

  @IsInt()
  item: Wish;

  @IsDecimal({ decimal_digits: '2' })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
