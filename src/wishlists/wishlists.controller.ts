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
import { WishListsService } from './wishlists.service';
import { WishList } from './entities/wishlist.entity';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

@Controller('wishlists')
export class WishListsController {
  constructor(private wishlistsService: WishListsService) {}

  @Get()
  findAll(): Promise<WishList[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(@Body() wishlist: CreateWishListDto): Promise<WishList> {
    return this.wishlistsService.create(wishlist);
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wishList = await this.wishlistsService.findById(id);
    if (!wishList) {
      throw new NotFoundException();
    }
    await this.wishlistsService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishListDto: UpdateWishListDto,
  ) {
    const wishList = await this.wishlistsService.findById(id);
    if (!wishList) {
      throw new NotFoundException();
    }
    await this.wishlistsService.updateById(id, updateWishListDto);
  }
}
