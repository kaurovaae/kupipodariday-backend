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
  constructor(private wishesService: WishesService) {}

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
    return this.wishesService.copyWish(req.user.id, id);
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
    await this.wishesService.removeWish(req.user.id, id);
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
    return this.wishesService.updateWish(req.user.id, id, updateWishDto);
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
    return this.wishesService.findWish(id);
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
    @Body() createWishDto: CreateWishRequestDto,
  ): Promise<Wish> {
    return this.wishesService.createWish(req.user.id, createWishDto);
  }
}
