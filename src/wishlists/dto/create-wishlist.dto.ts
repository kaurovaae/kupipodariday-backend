import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistRequestDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsArray()
  itemsId: number[];

  @IsUrl()
  image: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class CreateWishlistDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
