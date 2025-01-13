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
import { NoValidWishResponseDto } from './dto/no-valid-wish-response.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

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
