import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordStrategy } from '../passwords/interfaces/password-strategy.interface';
import { ListOptionsDto } from './dto/list-options.dto';
import { ListOptions } from './helpers/list-options';

class PasswordStrategyMock implements PasswordStrategy {
  async encrypt(password: string): Promise<string> {
    return Promise.resolve(`${password}-hashed`);
  }
  async matches(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(`${password}-hashed` === hash);
  }
}

describe('Users Controller', () => {
  let controller: UsersController;
  const srv = new UsersService(
    mongoose.model('User', UserSchema),
    new PasswordStrategyMock(),
  );

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'UsersService',
          useValue: srv,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    };
    const create = sinon.stub(srv, 'create');
    const getOne = sinon.stub(srv, 'getOne');

    create.returns({ id: 'some id' });

    await controller.create(createUserDto);

    create.restore();
    getOne.restore();

    sinon.assert.calledWith(create, createUserDto);
    sinon.assert.calledWith(getOne, 'some id');
  });

  it('should return users list', async () => {
    const getList = sinon.stub(srv, 'getList');
    const listOptionsDto: ListOptionsDto = {
      p: null,
      l: null,
      o: null,
      f: null,
    };

    await controller.getList(listOptionsDto);

    getList.restore();

    sinon.assert.calledWith(getList, new ListOptions(listOptionsDto));
  });

  it('should return one user', async () => {
    const id = 'qwerty';
    const getOne = sinon.stub(srv, 'getOne');
    getOne.returns('RESULT');

    const result = await controller.getOne(id);

    getOne.restore();

    sinon.assert.calledWith(getOne, id);
    expect(result).toBe('RESULT');
  });

  it('should throw exception if user not found', async () => {
    const id = 'qwerty';
    const getOne = sinon.stub(srv, 'getOne');

    getOne.returns(null);

    try {
      await controller.getOne(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    getOne.restore();

    sinon.assert.calledWith(getOne, id);
  });

  it('should update user', async () => {
    const id = 'qwerty';
    const updateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: '12345678',
    };
    const update = sinon.stub(srv, 'update');

    update.returns('RESULT');

    const result = await controller.update(id, updateUserDto);

    update.restore();

    sinon.assert.calledWith(update, id, updateUserDto);
    expect(result).toBe('RESULT');
  });

  it('should throw exception on update if user does not exists', async () => {
    const id = 'qwerty';
    const updateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: '12345678',
    };
    const update = sinon.stub(srv, 'update');

    update.returns(void 0);

    try {
      await controller.update(id, updateUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    update.restore();

    sinon.assert.calledWith(update, id, updateUserDto);
  });

  it('should delete user', async () => {
    const id = 'qwerty';
    const del = sinon.stub(srv, 'delete');

    del.returns(true);

    await controller.delete(id);

    del.restore();

    sinon.assert.calledWith(del, id);
  });

  it('should throw exception on delete if user does not exist', async () => {
    const id = 'qwerty';
    const del = sinon.stub(srv, 'delete');

    del.returns(false);

    try {
      await controller.delete(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    del.restore();

    sinon.assert.calledWith(del, id);
  });
});
