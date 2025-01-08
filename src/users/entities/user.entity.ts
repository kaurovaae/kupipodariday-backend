import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Min, Max } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // уникальный числовой идентификатор

  @CreateDateColumn()
  createdAt: Date; // дата создания

  @UpdateDateColumn()
  updatedAt: Date; // дата изменения

  @Column({
    unique: true,
  })
  @Min(2)
  @Max(30)
  username: string; // уникальное имя пользователя

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Min(2)
  @Max(200)
  about: string; // информация о пользователе

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string; // ссылка на аватар

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string; // уникальный адрес электронной почты пользователя

  @Column()
  password: string; // пароль пользователя

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]; // список желаемых подарков

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; // содержит список подарков, на которые скидывается пользователь

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]; // содержит список вишлистов, которые создал пользователь
}
