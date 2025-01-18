import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNumber,
  IsUrl,
  IsString,
  Length,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { ColumnNumericTransformer } from '../../transformers/column-numeric-transformer';

@Entity()
export class Wish {
  @ApiProperty({ description: 'Уникальный id подарка' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания подарка' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления подарка' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Название подарка', example: 'book' })
  @IsString()
  @Length(1, 250)
  @Column()
  name: string;

  @ApiProperty({
    description:
      'Ссылка на интернет-магазин, в котором можно приобрести подарок',
    example: 'https://market.yandex.ru/cc/eMGumTH',
  })
  @IsUrl()
  @Column()
  link: string;

  @ApiProperty({
    description: 'Ссылка на изображение подарка',
    example:
      'https://avatars.mds.yandex.net/get-mpic/4119784/img_id5125618244090341770.jpeg/optimize',
  })
  @IsUrl()
  @Column()
  image: string;

  @ApiProperty({
    description: 'Стоимость подарка',
    example: 5000,
  })
  @IsPositive()
  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  price: number;

  @ApiProperty({
    description:
      'Сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок',
    example: 200.55,
  })
  @IsOptional()
  @IsNumber()
  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User; // ссылка на пользователя, который добавил пожелание подарка

  @ApiProperty({
    description: 'Описание подарка',
    example:
      'Альтхофф Кори. Сам себе программист. Как научиться программировать и устроиться в Ebay. Мировой компьютерный бестселлер',
  })
  @Length(1, 1024)
  @IsString()
  @Column()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; // массив ссылок на заявки скинуться от других пользователей

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[]; // массив ссылок на вишлисты

  @Column({
    default: 0,
  })
  copied: number; // содержит cчётчик тех, кто скопировал подарок себе
}
