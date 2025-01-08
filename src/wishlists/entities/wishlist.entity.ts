import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptional, Min, Max } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => User, (user) => user.id)
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
  @IsOptional()
  @Max(1500)
  description: string; // описание подборки

  @Column()
  image: string; // обложка для подборки

  @OneToMany(() => Wish, (wish) => wish.id)
  items: number[]; // содержит набор ссылок на подарки
}
