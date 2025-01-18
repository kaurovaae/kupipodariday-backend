import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { ColumnNumericTransformer } from '../../transformers/column-numeric-transformer';

@Entity()
export class Offer {
  @ApiProperty({ description: 'Уникальный id оффера' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Дата создания пользователя' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления пользователя' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User; // id желающего скинуться

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: Wish; // ссылка на товар

  @ApiProperty({
    description: 'Сумма заявки',
    example: 5000,
  })
  @IsPositive()
  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  amount: number;

  @ApiProperty({
    description:
      'Флаг, который определяет показывать ли информацию о скидывающемся в списке',
    example: true,
  })
  @Column({
    default: false,
  })
  hidden: boolean;
}
