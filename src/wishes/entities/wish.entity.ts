import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNumber,
  IsInt,
  IsUrl,
  IsString,
  Length,
  // IsOptional,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Стоимость подарка',
    example: 1037.55,
  })
  @Column('decimal')
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    description:
      'Сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок',
    example: 1037.55,
  })
  @Column('decimal')
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: number; // ссылка на пользователя, который добавил пожелание подарка

  @ApiProperty({
    description: 'Описание подарка',
    example:
      'Альтхофф Кори. Сам себе программист. Как научиться программировать и устроиться в Ebay. Мировой компьютерный бестселлер',
  })
  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; // массив ссылок на заявки скинуться от других пользователей

  @Column({
    default: 0,
  })
  @IsInt()
  copied: number; // содержит cчётчик тех, кто скопировал подарок себе
}
