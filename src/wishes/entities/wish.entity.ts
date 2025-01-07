import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDecimal, IsInt, IsUrl, Min, Max } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { WishList } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => WishList, (wishlist) => wishlist.items)
  id: number; // уникальный числовой идентификатор

  @CreateDateColumn()
  createdAt: Date; // дата создания

  @UpdateDateColumn()
  updatedAt: Date; // дата изменения

  @Column()
  @Min(1)
  @Max(250)
  name: string; // название подарка

  @Column()
  link: string; // ссылка на интернет-магазин, в котором можно приобрести подарок

  @Column()
  @IsUrl()
  image: string; // ссылка на изображение подарка, строка

  @Column()
  @IsDecimal({ decimal_digits: '2' })
  price: number; // стоимость подарка

  @Column()
  @IsDecimal({ decimal_digits: '2' })
  raised: number; // сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User; // ссылка на пользователя, который добавил пожелание подарка

  @Column()
  @Min(1)
  @Max(1024)
  description: string; // строка с описанием подарка

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; // массив ссылок на заявки скинуться от других пользователей

  @Column()
  @IsInt()
  copied: number; // содержит cчётчик тех, кто скопировал подарок себе
}
