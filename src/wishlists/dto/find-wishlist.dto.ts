import { PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class FindWishlistDto extends PickType(Wishlist, []) {
  owner: {
    id: number;
  };
}
