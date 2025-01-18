import { OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class FindWishlistDto extends OmitType(Wishlist, []) {
  owner: {
    id: number;
  };
}
