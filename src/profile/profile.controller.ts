import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtGuard)
  @Get()
  profile(@Req() req) {
    const user = req.user;

    return `Logged in as ${user.username}`;
  }
}
