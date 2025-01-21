import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferRequestDto } from './dto/create-offer.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { FindOfferDto } from './dto/find-offer.dto';

@ApiBearerAuth()
@ApiTags('offers')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @ApiResponse({
    description: 'Возвращает оффер по указанному id',
    type: FindOfferDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Id оффера',
    example: '1',
  })
  @Get(':id')
  async findOne(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.offersService.findOne({ id });
  }

  @ApiResponse({
    status: 201,
    description: 'Возвращает созданный оффер',
    type: Offer,
  })
  @ApiBody({
    description: 'Данные оффера',
    type: CreateOfferRequestDto,
  })
  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() offer: CreateOfferRequestDto,
  ): Promise<Offer> {
    return this.offersService.createOffer(req.user.id, offer);
  }

  @ApiResponse({
    description: 'Возвращает список всех офферов',
    type: [FindOfferDto],
  })
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findMany({});
  }
}
