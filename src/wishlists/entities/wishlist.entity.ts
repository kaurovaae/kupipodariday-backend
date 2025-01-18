import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
  @ApiProperty({ description: 'Уникальный id вишлиста' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания вишлиста' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления вишлиста' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Название подарка', example: 'book' })
  @IsString()
  @Length(1, 250)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Описание подборки',
    example: 'Мой вишлист',
  })
  @MaxLength(1500)
  @IsString()
  @IsOptional()
  @Column({
    default: '',
  })
  description: string;

  @ApiProperty({
    description: 'Ссылка на изображение обложки для подборки',
    example: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  owner: User; // ссылка на пользователя, который добавил список пожеланий

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[]; // содержит набор ссылок на подарки
}
