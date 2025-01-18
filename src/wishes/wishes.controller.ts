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
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import {
  FindWishDto,
  LastWishResponseDto,
  TopWishResponseDto,
} from './dto/find-wish.dto';
import { CreateWishRequestDto } from './dto/create-wish.dto';
import { UpdateWishRequestDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { UsersService } from '../users/users.service';

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

  @ApiResponse({
    status: 200,
    description: 'Возвращает 40 подарков, добавленных недавно',
    type: [LastWishResponseDto],
  })
  @Get('last')
  findLast(): Promise<LastWishResponseDto[]> {
    return this.wishesService.findMany({}, LAST_WISHES_COUNT, {
      createdAt: 'DESC',
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает 20 популярных подарков',
    type: [TopWishResponseDto],
  })
  @Get('top')
  findTop(): Promise<TopWishResponseDto[]> {
    return this.wishesService.findMany({}, TOP_WISHES_COUNT, {
      copied: 'DESC',
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Копирует подарок текущему пользователю по заданному id',
    type: [Wish],
  })
  @ApiParam({
    name: 'id',
    description: 'Id подарка',
    example: '1',
  })
  @Post(':id/copy')
  async copyWish(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.usersService.findOne({ id: req.user.id });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.wishesService.findOne({ id });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    await this.wishesService.updateById(id, {
      copied: wish.copied + 1,
    });

    return this.wishesService.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      raised: 0,
      owner: user,
      wishlists: [],
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Удаляет подарок с заданным id',
  })
  @ApiParam({
    name: 'id',
    description: 'Id подарка',
    example: '1',
  })
  @Delete(':id')
  async removeById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const wish = await this.wishesService.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id !== req.user.id) {
      // Пользователь может удалить только свой (!) подарок
      throw new ServerException(ErrorCode.ConflictDeleteOtherWish);
    }

    if (wish.raised > 0) {
      // Пользователь может удалить подарок
      // только если никто ещё не решил скинуться
      throw new ServerException(ErrorCode.Conflict);
    }

    await this.wishesService.removeById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Обновляет данные подарка с заданным id',
    type: Wish,
  })
  @ApiParam({
    name: 'id',
    description: 'Id подарка',
    example: '1',
  })
  @ApiBody({
    description: 'Изменяемые данные подарка',
    type: UpdateWishRequestDto,
  })
  @Patch(':id')
  async updateById(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishRequestDto,
  ) {
    const wish = await this.wishesService.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id !== req.user.id) {
      // Пользователь может отредактировать описание своего (!) подарка
      throw new ServerException(ErrorCode.ConflictUpdateOtherWish);
    }

    if (updateWishDto.price && wish.raised > 0) {
      // Пользователь может отредактировать стоимость
      // только если никто ещё не решил скинуться
      throw new ServerException(ErrorCode.ConflictUpdateWishPrice);
    }

    return this.wishesService.updateById(id, updateWishDto);
  }

  @ApiResponse({
    description: 'Возвращает подарок по указанному id',
    type: FindWishDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Id подарка',
    example: '1',
  })
  @Get(':id')
  async findOne(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const wish = await this.wishesService.findOne(
      { id },
      {
        owner: {
          id: true,
          avatar: true,
          username: true,
        },
      },
      {
        owner: true,
        offers: {
          user: true,
        },
      },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    const { owner, offers, ...rest } = wish;

    return {
      ...rest,
      owner,
      offers: offers.map((offer) => ({
        createdAt: offer.createdAt,
        name: offer.user.username,
        amount: offer.hidden ? '***' : offer.amount,
        avatar: offer.user.avatar,
      })),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Возвращает созданный подарок',
    type: Wish,
  })
  @ApiBody({
    description: 'Данные подарка',
    type: CreateWishRequestDto,
  })
  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() wish: CreateWishRequestDto,
  ): Promise<Wish> {
    const user = await this.usersService.findOne({ id: req.user.id });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    if (wish.raised && wish.raised > wish.price) {
      throw new ServerException(ErrorCode.WishRaisedIsRatherThanPrice);
    }

    return this.wishesService.create({
      ...wish,
      owner: user,
    });
  }

  @ApiResponse({
    description: 'Возвращает список всех подарков',
    type: [Wish],
  })
  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findMany({});
  }
}
