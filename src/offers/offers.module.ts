import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => UsersModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
