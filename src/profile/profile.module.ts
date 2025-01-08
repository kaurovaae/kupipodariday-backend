import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtGuard } from '../guards/jwt.guard';

@Module({
  providers: [ProfileService, JwtGuard],
  controllers: [ProfileController],
})
export class ProfileModule {}
