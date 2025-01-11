import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findOne(id);
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
    const wish = await this.wishesService.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    }
    await this.wishesService.updateById(id, updateWishDto);
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @Post()
  create(@Body() wish: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(wish);
  }
}
