import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => WishesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
