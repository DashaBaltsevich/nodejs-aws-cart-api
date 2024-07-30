import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../../database/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(name: string) {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createOne({ name, password }: UserDto) {
    // const id = v4();
    // const newUser = this.userRepository.create({ id, name, password });

    const user = await this.userRepository.save({
      name,
      password,
    });

    console.log('newUser', user);

    return user;
  }
}
