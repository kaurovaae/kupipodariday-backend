import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { WishList } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
