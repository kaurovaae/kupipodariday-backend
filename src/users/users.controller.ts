import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../guards/jwt.guard';
import {
  FindOwnUserDto,
  FindUserDto,
  FindUserDtoRequest,
} from './dto/find-user.dto';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

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
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает список подарков пользователя',
    type: [Wish],
  })
  @Get('me/wishes')
  async getOwnWishes(@Req() req: Request & { user: { id: number } }) {
    return this.wishesService.findMany({
      owner: { id: req.user.id },
    });
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
    const user = await this.usersService.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return this.wishesService.findMany({
      owner: { id: user.id },
    });
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
    return this.usersService.updateById(req.user.id, updateUserDto);
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

  @ApiResponse({
    status: 200,
    description: 'Удаляет пользователя с заданным id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id пользователя',
    example: '1',
  })
  @Delete(':id')
  async removeById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    if (user.id !== req.user.id) {
      throw new ServerException(ErrorCode.ConflictDeleteOtherProfile);
    }

    await this.usersService.removeById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные пользователя с заданным id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id пользователя',
    example: '1',
  })
  @ApiBody({
    description: 'Изменяемые данные пользователя',
    type: UpdateUserDto,
  })
  @Patch(':id')
  async updateById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    if (user.id !== req.user.id) {
      throw new ServerException(ErrorCode.ConflictUpdateOtherProfile);
    }

    await this.usersService.updateById(id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает список существующих пользователей',
    type: [FindUserDto],
  })
  @Get()
  findAll(): Promise<FindUserDto[]> {
    return this.usersService.findMany({});
  }
}
