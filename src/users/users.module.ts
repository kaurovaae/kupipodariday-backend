import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => WishesModule),
    //
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard],
  exports: [UsersService],
})
export class UsersModule {}
