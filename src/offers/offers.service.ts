import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  async findById(id: number): Promise<Offer> {
    return this.offersRepository.findOneBy({ id });
  }

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offersRepository.save(createOfferDto);
  }

  async removeById(id: number) {
    return this.offersRepository.delete({ id });
  }

  async updateById(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offersRepository.update({ id }, updateOfferDto);
  }
}
