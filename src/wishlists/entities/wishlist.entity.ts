import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => User, (user) => user.wishlists)
  id: number; // уникальный числовой идентификатор

  @CreateDateColumn()
  createdAt: Date; // дата создания

  @UpdateDateColumn()
  updatedAt: Date; // дата изменения

  @Column()
  @Min(1)
  @Max(250)
  name: string; // название списка

  @Column()
  @Max(1500)
  description: string; // описание подборки

  @Column()
  image: string; // обложка для подборки

  @OneToMany(() => Wish, (wish) => wish.id)
  items: Wish[]; // содержит набор ссылок на подарки
}
