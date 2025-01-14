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
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { TopWishResponseDto } from './dto/top-wish-response.dto';
import { LastWishResponseDto } from './dto/last-wish-response.dto';
import { NoValidWishResponseDto } from './dto/no-valid-wish-response.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';

const TOP_WISHES_COUNT = Object.freeze(20);
const LAST_WISHES_COUNT = Object.freeze(40);

@ApiBearerAuth()
@ApiTags('wishes')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('wishes')
export class WishesController {
  constructor(
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @Get('last')
  findLast(): Promise<LastWishResponseDto[]> {
    return this.wishesService.findMany({
      take: LAST_WISHES_COUNT,
      order: { createdAt: 'DESC' },
    });
  }

  @Get('top')
  findTop(): Promise<TopWishResponseDto[]> {
    return this.wishesService.findMany({
      take: TOP_WISHES_COUNT,
      order: { copied: 'DESC' },
    });
  }

  @Delete(':id')
  async removeById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (!wish) {
      throw new ServerException(ErrorCode.NotFound);
    }

    if (wish.owner.id !== req.user.id || wish.raised > 0) {
      // Пользователь может удалить только свой подарок,
      // если только никто ещё не решил скинуться
      throw new ServerException(ErrorCode.Conflict);
    }

    await this.wishesService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (!wish) {
      throw new ServerException(ErrorCode.NotFound);
    }

    if (wish.owner.id !== req.user.id || wish.raised > 0) {
      // Пользователь может отредактировать описание своих подарков и стоимость,
      // если только никто ещё не решил скинуться
      throw new ServerException(ErrorCode.Conflict);
    }

    await this.wishesService.updateById(id, updateWishDto);
  }

  @ApiResponse({
    description: 'Возвращает подарок по id',
    type: Wish,
  })
  @Get(':id')
  async findOne(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    const {
      name,
      image,
      link,
      description,
      price,
      raised,
      offers,
      owner,
      createdAt,
    } = wish;

    if (wish.owner.id === user.id) {
      // Для своих подарков: название, изображение и ссылка на товар,
      // прогресс сбора средств и список участников
      return {
        id,
        name,
        image,
        link,
        description,
        price,
        raised,
        offers,
        owner,
        createdAt,
      };
    }

    // Для чужих подарков: отображение описания подарка, а также тех,
    // кто скидывается и по сколько (если участник не захотел скрыть сумму вклада).
    return {
      id,
      name,
      image,
      link,
      description,
      price,
      raised,
      owner,
      createdAt,
      offers: offers.map((offer) => ({
        createdAt: offer.createdAt,
        name: offer.user.username,
        amount: offer.hidden ? '***' : offer.amount,
        img: offer.user.avatar,
      })),
    };
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'Возвращает созданный подарок',
    type: Wish,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: NoValidWishResponseDto,
  })
  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() wish: CreateWishDto,
  ): Promise<Wish> {
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    return this.wishesService.create({
      ...wish,
      owner: user,
    });
  }
}
