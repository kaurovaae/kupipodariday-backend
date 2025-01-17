import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions): Promise<User> {
    return this.usersRepository.findOne(options);
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async findMany(options: FindManyOptions): Promise<FindUserDto[]> {
    return this.usersRepository.find(options);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hash = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      ...rest,
      password: hash,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const { password, ...rest } = updateUserDto;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      const user = { ...rest, password: hash };
      await this.usersRepository.update({ id }, user);
    } else {
      await this.usersRepository.update({ id }, updateUserDto);
    }

    return this.usersRepository.findOneBy({ id });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  async removeById(id: number) {
    return this.usersRepository.delete({ id });
  }
}
