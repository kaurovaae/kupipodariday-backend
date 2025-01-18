import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';

class ShortInfo {
  @ApiProperty({ description: 'Дата создания подарка' })
  createdAt: Date;

  @ApiProperty({ description: 'Название подарка', example: 'book' })
  name: string;

  @ApiProperty({
    description: 'Стоимость подарка (строка ***, если скрыто)',
    example: 5000,
  })
  amount: number | string;

  @ApiProperty({
    description: 'Ссылка на изображение подарка',
    example:
      'https://avatars.mds.yandex.net/get-mpic/4119784/img_id5125618244090341770.jpeg/optimize',
  })
  img: string;
}

export class FindWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'wishlists',
  'offers',
  'copied',
]) {
  offers: Offer[] | ShortInfo[];
}

export class LastWishResponseDto extends OmitType(Wish, [
  'id',
  'updatedAt',
  'offers',
  'copied',
]) {}

export class TopWishResponseDto extends OmitType(Wish, [
  'id',
  'updatedAt',
  'offers',
]) {}
