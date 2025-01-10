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
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException();
    }
    await this.offersService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException();
    }
    await this.offersService.updateById(id, updateOfferDto);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Post()
  create(@Body() offer: CreateOfferDto): Promise<Offer> {
    return this.offersService.create(offer);
  }
}
