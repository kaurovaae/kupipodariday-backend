import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByOffset(limit: number, offset: number) {
    return this.usersRepository.findAndCount({
      take: limit,
      skip: offset, // (page - 1) * limit,
    });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(options);
  }

  async findMany(options: FindOneOptions<User>): Promise<FindUsersDto[]> {
    return this.usersRepository.find(options);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hash = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      ...rest,
      password: hash,
    });
  }

  async removeById(id: number) {
    return this.usersRepository.delete({ id });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const { password, ...rest } = updateUserDto;
    const hash = await bcrypt.hash(password, 10);

    const user = {
      ...rest,
      password: hash,
    };
    await this.usersRepository.update({ id }, user);

    return this.findById(id);
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }
}
