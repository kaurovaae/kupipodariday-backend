import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { Offer } from './offers/entities/offer.entity';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { WishList } from './wishlists/entities/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [Offer, User, Wish, WishList],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
