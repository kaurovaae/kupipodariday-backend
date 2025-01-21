import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NoValidUserResponseDto } from './dto/no-valid-user-response.dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtGuard } from '../guards/jwt.guard';
import {
  FindOwnUserDto,
  FindUserDto,
  FindUserDtoRequest,
} from './dto/find-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@ApiExtraModels(User)
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает список подарков пользователя',
    type: [Wish],
  })
  @Get('me/wishes')
  async getOwnWishes(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.getOwnWishes(req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает список подарков пользователя с заданным username',
    type: [Wish],
  })
  @ApiParam({
    name: 'username',
    description: 'Имя пользователя',
    example: 'user',
  })
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return this.usersService.getUserWishes(username.toLowerCase());
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает данные пользователя',
    type: User,
  })
  @Get('me')
  async getOwnInfo(
    @Req() req: Request & { user: { id: number } },
  ): Promise<FindOwnUserDto> {
    return this.usersService.findOne({ id: req.user.id });
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные пользователя',
    type: UpdateUserDto,
  })
  @ApiBody({
    description: 'Изменяемые данные пользователя',
    type: UpdateUserDto,
  })
  @Patch('me')
  async updateOwnInfo(
    @Req() req: Request & { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает данные пользователя с указанным username',
    type: User,
  })
  @ApiParam({
    name: 'username',
    description: 'Имя пользователя',
    example: 'user',
  })
  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<FindUserDto> {
    return this.usersService.findOne(
      { username: username.toLowerCase() },
      {
        id: true,
        username: true,
        avatar: true,
        about: true,
      },
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя с указанными email или username',
    type: [FindUserDto],
  })
  @ApiBody({
    description: 'Имя или email пользователя',
    type: FindUserDtoRequest,
  })
  @Post('find')
  async findMany(@Body('query') query: string) {
    return this.usersService.findMany({
      where: [{ email: query }, { username: query }],
    });
  }
}
