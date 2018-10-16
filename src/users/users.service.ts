import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordStrategy } from '../passwords/interfaces/password-strategy.interface';
import { ListOptions } from './helpers/list-options';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject('passwordStrategy')
    private readonly passwordStrategy: PasswordStrategy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    user.passwordHash = await this.passwordStrategy.encrypt(
      createUserDto.password,
    );

    return await user.save();
  }

  async getList(options: ListOptions): Promise<User[]> {
    let query = this.userModel
      .find()
      .skip(options.offset)
      .limit(options.limit)
      .sort(options.order)
      .select('-passwordHash -__v');

    query = options.applyFilters(query);

    return await query.exec();
  }

  async getOne(id: string): Promise<User> {
    return await this.userModel
      .findOne({ _id: id })
      .select('-passwordHash -__v')
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.getOne(id);

    if (!user) {
      return;
    }

    for (const prop in updateUserDto) {
      if (prop !== 'password') {
        user[prop] = updateUserDto[prop];
      } else if (updateUserDto.password) {
        user.passwordHash = await this.passwordStrategy.encrypt(
          updateUserDto.password,
        );
      }
    }

    return await user.save();
  }

  async delete(id: string): Promise<boolean> {
    return !!(await this.userModel.findOneAndDelete({ _id: id }));
  }
}
