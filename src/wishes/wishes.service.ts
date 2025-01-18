import { Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
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

  async updateById(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update({ id }, updateWishDto);
    return this.wishesRepository.findOneBy({ id });
  }

  async removeById(id: number) {
    // TODO: delete relations
    return this.wishesRepository.delete({ id });
  }
}
