import { Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
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

  async updateById(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.wishlistsRepository.update({ id }, updateWishlistDto);
    return this.wishlistsRepository.findOneBy({ id });
  }

  async removeById(id: number) {
    return this.wishlistsRepository.delete({ id });
  }
}
