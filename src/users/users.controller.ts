import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { NoValidUserResponseDto } from './dto/no-valid-user-response.dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
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
  async getMyWishes(@Req() req: Request & { user: { id: number } }) {
    return this.wishesService.findMany({
      where: {
        owner: {
          id: req.user.id,
        },
      },
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает список подарков пользователя с заданным username',
    type: [Wish],
  })
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return this.wishesService.findMany({
      where: {
        owner: {
          id: user.id,
        },
      },
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя по токену',
    type: User,
  })
  @Get('me')
  async getUserInfo(
    @Req() req: Request & { user: { id: number } },
  ): Promise<GetUserDto> {
    return this.usersService.findOne({ where: { id: req.user.id } });
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные пользователя',
    type: User,
  })
  @Patch('me')
  async updateUserInfo(
    @Req() req: Request & { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя с указанным username',
    type: User,
  })
  @ApiParam({
    name: 'username',
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @Get(':username')
  findOne(@Param('username') username: string): Promise<FindUserDto> {
    return this.usersService.findOne({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        about: true,
      },
      relations: {
        wishes: true,
      },
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя с указанными email или username',
    type: User,
  })
  @ApiParam({
    name: 'query',
    description: 'Имя или email пользователя',
    example: 'Иван',
  })
  @Post('find')
  async findMany(@Query('query') query: string): Promise<FindUserDto> {
    return this.usersService.findOne({
      where: [{ email: query }, { username: query }],
    });
  }

  // @Post('findByOffset')
  // async findByOffset(
  //   @Query() limit: number,
  //   @Query() offset: number,
  // ): Promise<User[]> {
  //   const normalizedLimit = Math.min(limit, PAGE_SIZE);
  //
  //   const [users] = await this.usersService.findByOffset(
  //     normalizedLimit,
  //     offset,
  //   );
  //
  //   return users;
  // }

  // @Delete(':id')
  // async removeById(@Param('id', ParseIntPipe) id: number) {
  //   const user = await this.usersService.findById(id);
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   await this.usersService.removeById(id);
  // }
  //
  // @Patch(':id')
  // async updateById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const user = await this.usersService.findById(id);
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   await this.usersService.updateById(id, updateUserDto);
  // }
  //
  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }
}
