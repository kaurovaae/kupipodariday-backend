import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (!wishlist) {
      throw new NotFoundException();
    }
    await this.wishlistsService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (!wishlist) {
      throw new NotFoundException();
    }
    await this.wishlistsService.updateById(id, updateWishlistDto);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(@Body() wishlist: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistsService.create(wishlist);
  }
}
