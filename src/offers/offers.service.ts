import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto, CreateOfferRequestDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => WishesService))
    private wishesService: WishesService,
  ) {}

  async findOne(
    options: FindOptionsWhere<Offer>,
    fields?: FindOptionsSelect<Offer>,
    join?: FindOptionsRelations<Offer>,
  ): Promise<Offer> {
    return this.offersRepository.findOne({
      where: options,
      select: fields,
      relations: join,
    });
  }

  async findMany(
    options: FindOptionsWhere<Offer>,
    take?: number,
    order?: FindOptionsOrder<Offer>,
  ): Promise<Offer[]> {
    return this.offersRepository.find({
      where: options,
      take,
      order,
    });
  }

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offersRepository.save(createOfferDto);
  }

  // Пользователю нельзя удалять и редактировать заявки (передумать тут нельзя)
  //
  // async updateById(id: number, updateOfferDto: UpdateOfferDto) {
  //   await this.offersRepository.update({ id }, updateOfferDto);
  //   return this.offersRepository.findOneBy({ id });
  // }
  //
  // async removeById(id: number) {
  //   return this.offersRepository.delete({ id });
  // }

  async createOffer(
    userId: number,
    createOfferDto: CreateOfferRequestDto,
  ): Promise<Offer> {
    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new ServerException(ErrorCode.Unauthorized);
    }

    const wish = await this.wishesService.findOne(
      { id: createOfferDto.itemId },
      { owner: { id: true } },
      { owner: true },
    );

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner?.id === userId) {
      // Пользователю нельзя вносить деньги на собственные подарки
      throw new ServerException(ErrorCode.ConflictCreateOwnWishOffer);
    }

    const { itemId, amount, hidden } = createOfferDto;

    const raised = +wish.raised + +amount;

    if (raised > wish.price) {
      throw new ServerException(ErrorCode.ConflictUpdateOfferTooMuchMoney);
    }

    await this.wishesService.update(itemId, { raised });

    return this.create({
      item: wish,
      user,
      amount,
      hidden,
    });
  }
}
