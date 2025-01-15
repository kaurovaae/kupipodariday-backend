import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  //
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateOfferDto {
  item: {
    id: number;
  };

  user: {
    id: number;
  };

  amount: number;

  hidden: boolean;
}

export class CreateOfferRequestDto {
  @IsInt()
  itemId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Column('decimal', {
    scale: 2,
  })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
