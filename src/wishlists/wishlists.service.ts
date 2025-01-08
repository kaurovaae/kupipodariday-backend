import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { WishList } from './entities/wishlist.entity';

@Injectable()
export class WishListsService {
  constructor(
    @InjectRepository(WishList)
    private wishlistsRepository: Repository<WishList>,
  ) {}

  async findAll(): Promise<WishList[]> {
    return this.wishlistsRepository.find();
  }

  async findById(id: number): Promise<WishList> {
    return this.wishlistsRepository.findOneBy({ id });
  }

  async create(createWishListDto: CreateWishListDto): Promise<WishList> {
    return this.wishlistsRepository.save(createWishListDto);
  }

  async removeById(id: number) {
    return this.wishlistsRepository.delete({ id });
  }

  async updateById(id: number, updateWishListDto: UpdateWishListDto) {
    return this.wishlistsRepository.update({ id }, updateWishListDto);
  }
}
