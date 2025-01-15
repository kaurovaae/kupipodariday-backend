import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistRequestDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
  'owner',
]) {}

export class CreateWishlistDto extends CreateWishlistRequestDto {
  owner: {
    id: number;
  };
}
