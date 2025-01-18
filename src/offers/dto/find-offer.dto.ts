import { OmitType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';

export class FindOfferDto extends OmitType(Offer, []) {}
