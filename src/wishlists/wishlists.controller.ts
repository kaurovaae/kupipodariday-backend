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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistRequestDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { Request } from 'express';
import { In } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';

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
  ) {}

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne({ where: { id } });
    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }
    await this.wishlistsService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne({ where: { id } });
    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }
    await this.wishlistsService.updateById(id, updateWishlistDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne({
      where: { id },
      select: {
        items: true,
        owner: {
          id: true,
        },
      },
      relations: {
        items: true,
        owner: true,
      },
    });
    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }
    return wishlist;
  }

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() wishlist: CreateWishlistRequestDto,
  ): Promise<Wishlist> {
    console.log('wishlist', wishlist)
    const { itemsId, ...rest } = wishlist;

    console.log(itemsId)

    const wishes = await this.wishesService.findMany({
      where: {
        id: In(itemsId),
      },
    });

    console.log(wishes);

    return this.wishlistsService.create({
      ...rest,
      items: wishes,
      owner: {
        id: req.user.id,
      },
    });
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findMany({});
  }
}
