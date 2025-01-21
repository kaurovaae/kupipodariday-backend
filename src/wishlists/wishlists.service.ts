import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateWishlistDto,
  CreateWishlistRequestDto,
} from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
  ) {}

  async findOne(
    options: FindOptionsWhere<Wishlist>,
    fields?: FindOptionsSelect<Wishlist>,
    join?: FindOptionsRelations<Wishlist>,
  ): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({
      where: options,
      select: fields,
      relations: join,
    });
  }

  async findMany(
    options: FindOptionsWhere<Wishlist>,
    take?: number,
    order?: FindOptionsOrder<Wishlist>,
  ): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      where: options,
      take,
      order,
    });
  }

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistsRepository.save(createWishlistDto);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.wishlistsRepository.update({ id }, updateWishlistDto);
    return this.wishlistsRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.wishlistsRepository.delete({ id });
  }

  async findWishlist(id: number) {
    const wishlist = await this.findOne(
      { id },
      {
        items: true,
        owner: {
          id: true,
        },
      },
      {
        items: true,
        owner: true,
      },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    return wishlist;
  }

  async createWishlist(userId: number, wishlist: CreateWishlistRequestDto) {
    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const { itemsId, image, name, description } = wishlist;

    if (!itemsId) {
      throw new ServerException(ErrorCode.EmptyItemsId);
    }

    const wishes = await this.wishesService.findMany({ id: In(itemsId) });

    if (!wishes) {
      throw new ServerException(ErrorCode.WishesNotFound);
    }

    return this.create({
      image,
      name,
      description,
      items: wishes,
      owner: user,
    });
  }

  async updateWishlist(
    userId: number,
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner?.id !== userId) {
      // Пользователь может отредактировать только свой вишлист
      throw new ServerException(ErrorCode.ConflictUpdateOtherWishlist);
    }

    return this.update(id, updateWishlistDto);
  }

  async removeWishlist(userId: number, id: number) {
    const wishlist = await this.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist.owner?.id !== userId) {
      // Пользователь может удалить только свой вишлист
      throw new ServerException(ErrorCode.ConflictDeleteOtherWishlist);
    }

    return this.remove(id);
  }
}
