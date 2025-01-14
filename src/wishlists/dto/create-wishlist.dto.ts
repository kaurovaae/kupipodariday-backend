import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
