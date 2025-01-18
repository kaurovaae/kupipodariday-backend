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
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistRequestDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { FindWishlistDto } from './dto/find-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { Request } from 'express';
import { In } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@ApiTags('wishlistlists')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private wishlistsService: WishlistsService,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Удаляет вишлист с заданным id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id вишлиста',
    example: '1',
  })
  @Delete(':id')
  async removeById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const wishlist = await this.wishlistsService.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner?.id !== req.user.id) {
      // Пользователь может удалить только свой вишлист
      throw new ServerException(ErrorCode.Conflict);
    }

    await this.wishlistsService.removeById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные вишлиста с заданным id',
    type: Wishlist,
  })
  @ApiParam({
    name: 'id',
    description: 'Id вишлиста',
    example: '1',
  })
  @ApiBody({
    description: 'Изменяемые данные вишлиста',
    type: UpdateWishlistDto,
  })
  @Patch(':id')
  async updateById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner?.id !== req.user.id) {
      // Пользователь может отредактировать только свой вишлист
      throw new ServerException(ErrorCode.Conflict);
    }

    return this.wishlistsService.updateById(id, updateWishlistDto);
  }

  @ApiResponse({
    description: 'Возвращает вишлист по указанному id',
    type: FindWishlistDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Id вишлиста',
    example: '1',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(
      { id },
      {
        items: true,
        owner: {
          id: true,
        },
      },
      {
        items: true,
        owner: true,
      },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    return wishlist;
  }

  @ApiResponse({
    status: 201,
    description: 'Возвращает созданный вишлист',
    type: Wishlist,
  })
  @ApiBody({
    description: 'Данные вишлиста',
    type: CreateWishlistRequestDto,
  })
  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() wishlist: CreateWishlistRequestDto,
  ): Promise<Wishlist> {
    const user = await this.usersService.findOne({ id: req.user.id });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const { itemsId, image, name, description } = wishlist;

    if (!itemsId) {
      throw new ServerException(ErrorCode.EmptyItemsId);
    }

    const wishes = await this.wishesService.findMany({ id: In(itemsId) });

    if (!wishes) {
      throw new ServerException(ErrorCode.WishesNotFound);
    }

    return this.wishlistsService.create({
      image,
      name,
      description,
      items: wishes,
      owner: user,
    });
  }

  @ApiResponse({
    description: 'Возвращает список всех вишлистов',
    type: [Wishlist],
  })
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findMany({});
  }
}
