import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, IsOptional, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { ColumnLowercaseTransformer } from '../../transformers/column-lowercase-transformer';

@Entity()
export class User {
  @ApiProperty({ description: 'Уникальный id пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания пользователя' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления пользователя' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Имя пользователя', example: 'user' })
  @IsString()
  @Length(2, 30)
  @Column({
    unique: true,
    transformer: new ColumnLowercaseTransformer(),
  })
  username: string; // уникальное имя пользователя

  @ApiProperty({
    description: 'Описание пользователя',
    example: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  about: string; // информация о пользователе

  @ApiProperty({
    description: 'Аватар пользователя',
    example: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  @IsOptional()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string; // ссылка на аватар

  @ApiProperty({ description: 'Email пользователя', example: 'test@test.zone' })
  @IsEmail()
  @Column({
    unique: true,
    transformer: new ColumnLowercaseTransformer(),
  })
  email: string; // уникальный адрес электронной почты пользователя

  @ApiProperty({ description: 'Пароль пользователя', example: 'testpassword' })
  @Column({ select: false })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]; // список желаемых подарков

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; // содержит список подарков, на которые скидывается пользователь

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]; // содержит список вишлистов, которые создал пользователь
}
