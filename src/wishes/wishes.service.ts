import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishesRepository.findOneBy({ id });
  }

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishesRepository.save(createWishDto);
  }

  async removeById(id: number) {
    return this.wishesRepository.delete({ id });
  }

  async updateById(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update({ id }, updateWishDto);
  }
}
