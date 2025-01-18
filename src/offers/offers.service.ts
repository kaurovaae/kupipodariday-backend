import { Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
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

  async updateById(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offersRepository.save({
      ...updateOfferDto,
      id,
    });
  }

  async removeById(id: number) {
    return this.offersRepository.delete({ id });
  }
}
