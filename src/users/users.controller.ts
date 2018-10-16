import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListOptionsDto } from './dto/list-options.dto';
import { ListOptions } from './helpers/list-options';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.getOne(user.id);
  }

  @Get()
  async getList(@Query() listOptionsDto: ListOptionsDto): Promise<User[]> {
    const options = new ListOptions(listOptionsDto);
    return this.usersService.getList(options);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<User> {
    const user: User = await this.usersService.getOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user: User = await this.usersService.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const result: boolean = await this.usersService.delete(id);

    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
