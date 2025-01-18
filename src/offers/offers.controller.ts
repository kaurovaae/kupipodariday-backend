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
    status: 200,
    description: 'Удаляет оффер с заданным id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id оффера',
    example: '1',
  })
  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne({ id });

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }

    await this.offersService.removeById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные оффера с заданным id',
    type: Offer,
  })
  @ApiParam({
    name: 'id',
    description: 'Id оффера',
    example: '1',
  })
  @ApiBody({
    description: 'Изменяемые данные оффера',
    type: UpdateOfferDto,
  })
  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.offersService.findOne({ id });

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }

    return this.offersService.updateById(id, updateOfferDto);
  }

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

    const wish = await this.wishesService.findOne({ id: offer.itemId });

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

  @ApiResponse({
    description: 'Возвращает список всех офферов',
    type: [FindOfferDto],
  })
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findMany({});
  }
}
