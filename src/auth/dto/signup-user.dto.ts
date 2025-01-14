import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignupUserResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'generatedaccesstoken',
  })
  access_token: string;
}

export class SignupUserDto extends CreateUserDto {}
