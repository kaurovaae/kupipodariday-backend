import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListsController } from './wishlists.controller';
import { WishListsService } from './wishlists.service';
import { WishList } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  controllers: [WishListsController],
  providers: [WishListsService],
})
export class WishlistsModule {}
