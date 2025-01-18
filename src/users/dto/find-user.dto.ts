import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class FindUserDtoRequest {
  @ApiProperty({ description: 'Имя или email пользователя', example: 'user' })
  query: string;
}

export class FindUserDto extends PickType(User, ['email', 'password']) {}

export class FindOwnUserDto extends OmitType(User, [
  'wishes',
  'offers',
  'wishlists',
]) {}
