import { OmitType, PartialType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';
import { CreateWishDto } from './create-wish.dto';

export class BasicUpdateWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'offers',
  'raised',
]) {}

export class UpdateWishRequestDto extends PartialType(BasicUpdateWishDto) {}

export class UpdateWishDto extends PartialType(CreateWishDto) {
  copied?: number;
}
