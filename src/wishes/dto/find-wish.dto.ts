import { OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';

export class CreateWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'offers',
  'copied',
]) {}

export class CreateWishRequestDto extends OmitType(CreateWishDto, ['owner']) {}
