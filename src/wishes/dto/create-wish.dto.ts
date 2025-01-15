import { OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';

export class CreateWishRequestDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'offers',
  'copied',
  'owner',
]) {}

export class CreateWishDto extends CreateWishRequestDto {
  owner: {
    id: number;
  };
}
