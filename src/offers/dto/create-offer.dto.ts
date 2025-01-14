import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  //
} from 'class-validator';
import { Column } from 'typeorm';
import { OmitType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

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
