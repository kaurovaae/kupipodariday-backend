import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferRequestDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
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

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOneById(id);

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }

    await this.offersService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.offersService.findOneById(id);

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }

    await this.offersService.updateById(id, updateOfferDto);
  }

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() offer: CreateOfferRequestDto,
  ): Promise<Offer> {
    const user = await this.usersService.findOneById(req.user.id);

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.wishesService.findOne({
      where: { id: offer.itemId },
    });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    const { itemId, amount } = offer;

    const raised = +wish.raised + +amount;

    if (raised > wish.price) {
      throw new ServerException(ErrorCode.TooMuchMoney);
    }

    // TODO: обернуть в транзакции на случай ошибок
    // TODO: математические операции с деньгами (кейсы копеек)
    // TODO: модели запросов / ответов

    await this.wishesService.updateById(itemId, { raised });

    return this.offersService.create({
      item: wish,
      user: user,
      amount: offer.amount,
      hidden: offer.hidden,
    });

    // const queryRunner = this.dataSource.createQueryRunner();
    //
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   // Сохраняем всех пользователей
    //   await Promise.all(users.map((user)=>queryRunner.manager.save(user));
    //
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }
}
