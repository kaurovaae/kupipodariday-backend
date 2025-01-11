import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class FindUsersDto extends PickType(User, ['username', 'email']) {}
