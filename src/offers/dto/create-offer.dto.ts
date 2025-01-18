import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class CreateOfferRequestDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
  'user',
  'item',
]) {
  @ApiProperty({ description: 'Уникальный id подарка', example: 1 })
  @IsInt()
  itemId: number;
}
