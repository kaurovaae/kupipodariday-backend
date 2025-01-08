import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDecimal } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number; // уникальный числовой идентификатор

  @CreateDateColumn()
  createdAt: Date; // дата создания

  @UpdateDateColumn()
  updatedAt: Date; // дата изменения

  @ManyToOne(() => User, (user) => user.id)
  user: number; // id желающего скинуться

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: number; // ссылка на товар

  @Column()
  @IsDecimal({ decimal_digits: '2' })
  amount: number; // сумма заявки

  @Column({
    default: false,
  })
  hidden: boolean; // флаг, который определяет показывать ли информацию о скидывающемся в списке.
}
