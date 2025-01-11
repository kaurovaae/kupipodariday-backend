import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NoValidUserResponseDto {
  @ApiProperty({ example: '40*' })
  @IsNumber()
  statusCode: number;

  @ApiProperty({ example: ['% must be an %'] })
  @IsArray()
  message: string[];

  @ApiProperty({ example: 'Error message' })
  @IsString()
  error: string;
}
