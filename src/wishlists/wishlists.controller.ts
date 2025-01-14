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
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { NoValidUserResponseDto } from '../users/dto/no-valid-user-response.dto';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@ApiBearerAuth()
@ApiTags('wishlistlists')
@UseGuards(JwtGuard)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: NoValidUserResponseDto,
})
@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private wishlistsService: WishlistsService,
    private usersService: UsersService,
  ) {}

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (!wishlist) {
      throw new ServerException(ErrorCode.NotFound);
    }
    await this.wishlistsService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistsService.findOne(id);
    if (!wishlist) {
      throw new ServerException(ErrorCode.NotFound);
    }
    await this.wishlistsService.updateById(id, updateWishlistDto);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Req() req: Request & { user: { id: number } },
    @Body() wishlist: CreateWishlistDto,
  ): Promise<Wishlist> {
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    return this.wishlistsService.create({
      ...wishlist,
      owner: user,
    });
  }
}
