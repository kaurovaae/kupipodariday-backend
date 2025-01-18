import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class SigninUserResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'generatedAccessToken',
  })
  access_token: string;
}

export class SigninUserDto extends PickType(User, ['username', 'password']) {}
