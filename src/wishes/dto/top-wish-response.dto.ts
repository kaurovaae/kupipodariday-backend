import { OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';

export class TopWishResponseDto extends OmitType(Wish, [
  'id',
  'updatedAt',
  'offers',
  'copied',
]) {}
