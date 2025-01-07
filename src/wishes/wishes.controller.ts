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
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @Post()
  create(@Body() wish: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(wish);
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findById(id);
    if (!wish) {
      throw new NotFoundException();
    }
    await this.wishesService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findById(id);
    if (!wish) {
      throw new NotFoundException();
    }
    await this.wishesService.updateById(id, updateWishDto);
  }
}
