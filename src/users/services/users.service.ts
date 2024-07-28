import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/database/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOneById(userId: string): Promise<UserEntity> {
    console.log('[UsersService], findOneById, id: ', userId);
    return await this.userRepo.findOneBy({ id: userId });
  }

  async findOneByName(userName: string): Promise<UserEntity> {
    console.log('[UsersService], findOneByName, userName: ', userName);
    return await this.userRepo.findOneBy({ name: userName });
  }

  async createOne({ name, password, email }: CreateUserDto) {
    console.log('[UsersService], createOne, name: ', name);
    console.log('[UsersService], createOne, email: ', email);

    try {
      const id = v4();

      const newUser = this.userRepo.create({ id, name, password, email });

      console.log('[UsersService], createOne, new user: ', newUser);

      const user = await this.userRepo.save(newUser);

      return user;
    } catch (error) {
      console.log('[UsersService], createOne, error: ', error);
    }
  }
}
