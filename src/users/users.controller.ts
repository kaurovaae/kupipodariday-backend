import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getUserInfo(@Req() req: Request & { user: User }) {
    /* Исключаем пароль из результата */
    const { password, ...rest } = req.user;
    return rest;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUserInfo(
    @Req() req: Request & { user: User },
    @Body() body: UpdateUserDto,
  ) {
    const { password, ...rest } = body;
    const hash = await bcrypt.hash(password, 10);

    await this.usersService.updateById(req.user.id, {
      ...rest,
      password: hash,
    });
  }

  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersService.removeById(id);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersService.updateById(id, updateUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    const { password, ...rest } = user;
    const hash = await bcrypt.hash(password, 10);

    return this.usersService.create({
      ...rest,
      password: hash,
    });
  }
}
