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
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { FindOfferDto } from './dto/find-offer.dto';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@ApiTags('offers')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('offers')
export class OffersController {
  constructor(
    private offersService: OffersService,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

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
    return this.wishesService.findOne({ id });
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
    const user = await this.usersService.findOne({ id: req.user.id });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.wishesService.findOne(
      { id: offer.itemId },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id === req.user.id) {
      // Пользователю нельзя вносить деньги на собственные подарки
      throw new ServerException(ErrorCode.ConflictCreateOwnWishOffer);
    }

    const { itemId, amount } = offer;

    const raised = +wish.raised + +amount;

    if (raised > wish.price) {
      throw new ServerException(ErrorCode.ConflictUpdateOfferTooMuchMoney);
    }

    await this.wishesService.updateById(itemId, { raised });

    return this.offersService.create({
      item: wish,
      user: user,
      amount: offer.amount,
      hidden: offer.hidden,
    });
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
