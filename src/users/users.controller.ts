import { Request } from 'express';
import {
  Body,
  Controller,
  // Delete,
  Get,
  // NotFoundException,
  Param,
  // ParseIntPipe,
  Patch,
  Post,
  // Query,
  Req,
  UseGuards,
  HttpCode,
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
import { NoValidUserResponseDto } from './dto/no-valid-user-response.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { FindUsersDto } from './dto/find-users.dto';
import { WishesService } from '../wishes/wishes.service';

// const PAGE_SIZE = 10;

@ApiBearerAuth()
@ApiTags('users')
@ApiExtraModels(User)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя по токену',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: NoValidUserResponseDto,
  })
  @Get('me/wishes')
  async getUserWishes(@Req() req: Request & { user: { id: number } }) {
    return this.wishesService.findMany({
      where: {
        owner: req.user.id,
      },
    });
  }

  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Возвращает пользователя по токену',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: NoValidUserResponseDto,
  })
  @Get('me')
  async getUserInfo(@Req() req: Request & { user: { id: number } }) {
    return this.usersService.findOne({
      where: {
        id: req.user.id,
      },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUserInfo(
    @Req() req: Request & { user: { id: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @ApiParam({
    name: 'username',
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne({
      where: { username },
    });
  }

  @Post('find')
  @HttpCode(200)
  async findMany(@Body() findUsersDto: FindUsersDto): Promise<FindUsersDto[]> {
    const { email, username } = findUsersDto;
    return this.usersService.findMany({ where: [{ email }, { username }] });
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
