import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto, CreateWishRequestDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async findOne(
    options: FindOptionsWhere<Wish>,
    fields?: FindOptionsSelect<Wish>,
    join?: FindOptionsRelations<Wish>,
  ): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: options,
      select: fields,
      relations: join,
    });
  }

  async findMany(
    options: FindOptionsWhere<Wish>,
    take?: number,
    order?: FindOptionsOrder<Wish>,
  ): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: options,
      take,
      order,
    });
  }

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishesRepository.save(createWishDto);
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update({ id }, updateWishDto);
    return this.wishesRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.wishesRepository.delete({ id });
  }

  async findWish(id: number) {
    const wish = await this.findOne(
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

  async createWish(userId: number, createWishDto: CreateWishRequestDto) {
    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    if (createWishDto.raised && createWishDto.raised > createWishDto.price) {
      throw new ServerException(ErrorCode.WishRaisedIsRatherThanPrice);
    }

    return this.create({
      ...createWishDto,
      owner: user,
    });
  }

  async updateWish(userId: number, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id !== userId) {
      // Пользователь может отредактировать описание своего (!) подарка
      throw new ServerException(ErrorCode.ConflictUpdateOtherWish);
    }

    if (updateWishDto.price && wish.raised > 0) {
      // Пользователь может отредактировать стоимость
      // только если никто ещё не решил скинуться
      throw new ServerException(ErrorCode.ConflictUpdateWishPrice);
    }

    return this.update(id, updateWishDto);
  }

  async removeWish(userId: number, id: number) {
    const wish = await this.findOne(
      { id },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id !== userId) {
      // Пользователь может удалить только свой (!) подарок
      throw new ServerException(ErrorCode.ConflictDeleteOtherWish);
    }

    if (wish.raised > 0) {
      // Пользователь может удалить подарок
      // только если никто ещё не решил скинуться
      throw new ServerException(ErrorCode.Conflict);
    }

    return this.remove(id);
  }

  async copyWish(userId: number, id: number) {
    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.findOne({ id });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    await this.update(id, { copied: wish.copied + 1 });

    return this.create({
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
}
