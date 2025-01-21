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
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('wishlistlists')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

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
    await this.wishlistsService.removeWishlist(req.user.id, id);
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
    return this.wishlistsService.updateWishlist(
      req.user.id,
      id,
      updateWishlistDto,
    );
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
    return this.wishlistsService.findWishlist(id);
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
    return this.wishlistsService.createWishlist(req.user.id, wishlist);
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
