import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
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

  async findMany(options: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistsRepository.find(options);
  }

  async findOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOne(options);
  }

  async findOneById(id: number): Promise<Wishlist> {
    return this.wishlistsRepository.findOneBy({ id });
  }

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistsRepository.save(createWishlistDto);
  }

  async removeById(id: number) {
    return this.wishlistsRepository.delete({ id });
  }

  async updateById(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistsRepository.update({ id }, updateWishlistDto);
  }
}
