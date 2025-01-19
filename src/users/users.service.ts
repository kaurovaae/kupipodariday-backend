import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(
    options: FindOptionsWhere<User>,
    fields?: FindOptionsSelect<User>,
    join?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.usersRepository.findOne({
      where: options,
      select: fields,
      relations: join,
    });
  }

  async findMany(options: FindManyOptions): Promise<FindUserDto[]> {
    return this.usersRepository.find(options);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, username, ...rest } = createUserDto;

    const isExists = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (isExists) {
      throw new ServerException(ErrorCode.UserAlreadyExists);
    }

    const hash = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      ...rest,
      password: hash,
      email,
      username,
    });
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<FindUserDto> {
    const { email, username } = updateUserDto;

    const user = await this.usersRepository.findOneBy({ id });

    // проверяем, что пользователь действительно пытается изменить свои данные
    // и таких данных не существует у других пользователей
    if (username && user.username !== username.toLowerCase()) {
      const isExists = await this.usersRepository.findOneBy({ username });

      if (isExists) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }

    // проверяем, что пользователь действительно пытается изменить свои данные
    // и таких данных не существует у других пользователей
    if (email && user.email !== email.toLowerCase()) {
      const isExists = await this.usersRepository.findOneBy({ email });

      if (isExists) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }

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

  async removeById(id: number) {
    return this.usersRepository.delete({ id });
  }
}
