import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
import { NoValidWishResponseDto } from './dto/no-valid-wish-response.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';

const TOP_WISHES_COUNT = Object.freeze(20);
const LAST_WISHES_COUNT = Object.freeze(40);

@ApiBearerAuth()
@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @Get('last')
  findLast(): Promise<Wish[]> {
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
  async removeById(@Param('id') id: number) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (!wish) {
      throw new NotFoundException();
    }
    await this.wishesService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne({ where: { id } });
    if (!wish) {
      throw new NotFoundException();
    }
    await this.wishesService.updateById(id, updateWishDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.wishesService.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @UseGuards(JwtGuard)
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
