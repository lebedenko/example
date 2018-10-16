import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import 'sinon-mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { PasswordStrategy } from '../passwords/interfaces/password-strategy.interface';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListOptions, DEFAULT_LIMIT } from './helpers/list-options';

class PasswordStrategyMock implements PasswordStrategy {
  async encrypt(password: string): Promise<string> {
    return Promise.resolve(`${password}-hashed`);
  }
  async matches(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(`${password}-hashed` === hash);
  }
}

describe('UsersService', () => {
  let service: UsersService;
  let passwordStrategy: PasswordStrategy;
  const Model = mongoose.model('User', UserSchema);
  const saveStub = sinon.stub(Model.prototype, 'save');
  const createUserDto: CreateUserDto = {
    firstName: 'Fname',
    lastName: 'Lname',
    email: 'some@email.com',
    password: '12345',
  };
  const updateUserDto: UpdateUserDto = {
    firstName: 'user',
    lastName: 'test',
    email: 'user.test@email.com',
    password: 'xyz',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
        {
          provide: 'passwordStrategy',
          useClass: PasswordStrategyMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    passwordStrategy = module.get<PasswordStrategy>('passwordStrategy');
  });

  afterAll(() => {
    saveStub.restore();
  });

  afterEach(() => {
    saveStub.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    saveStub.returnsThis();

    const result = await service.create(createUserDto);

    expect(result._id).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.passwordHash).toBe(
      await passwordStrategy.encrypt(createUserDto.password),
    );
  });

  it('should return default users list', async () => {
    const listOptions = new ListOptions({
      p: undefined,
      l: undefined,
      o: undefined,
      f: undefined,
    });
    const mock = sinon.mock(Model);

    mock
      .expects('find')
      .chain('skip')
      .withArgs(0)
      .chain('limit')
      .withArgs(DEFAULT_LIMIT)
      .chain('sort')
      .withArgs(null)
      .chain('select')
      .withArgs('-passwordHash -__v')
      .chain('exec')
      .resolves([]);

    const result = await service.getList(listOptions);

    mock.verify();
    expect(result).toEqual([]);
  });

  it('should return customized users list', async () => {
    const listOptions = new ListOptions({
      p: '5',
      l: '10',
      o: '-firstName',
      f: 'lastName:Doe',
    });
    const mock = sinon.mock(Model);

    mock
      .expects('find')
      .chain('skip')
      .withArgs(40)
      .chain('limit')
      .withArgs(10)
      .chain('sort')
      .withArgs('-firstName')
      .chain('select')
      .withArgs('-passwordHash -__v')
      .chain('where')
      .withArgs({ lastName: 'Doe' })
      .chain('exec')
      .resolves([]);

    const result = await service.getList(listOptions);

    mock.verify();
    expect(result).toEqual([]);
  });

  it('should return one user', async () => {
    const id = 'abcd';
    const user = { id };
    const mock = sinon.mock(Model);

    mock
      .expects('findOne')
      .withArgs({ _id: id })
      .chain('select')
      .withArgs('-passwordHash -__v')
      .chain('exec')
      .resolves(user);

    const result = await service.getOne(id);

    mock.verify();
    expect(result).toEqual(user);
  });

  it('should update user', async () => {
    saveStub.returnsThis();
    const user = await service.create(createUserDto);
    const passwordHash = user.passwordHash;
    const getOneStub = sinon.stub(service, 'getOne');

    getOneStub.withArgs(user.id).returns(user);

    const result = await service.update(user.id, updateUserDto);

    getOneStub.restore();
    expect(result.id).toBe(user.id);
    expect(result.passwordHash).toBe(
      await passwordStrategy.encrypt(updateUserDto.password),
    );
    expect(result.passwordHash).not.toBe(passwordHash);
    expect(result.firstName).toBe(updateUserDto.firstName);
    expect(result.lastName).toBe(updateUserDto.lastName);
    expect(result.email).toBe(updateUserDto.email);
  });

  it('should not change password', async () => {
    saveStub.returnsThis();
    const user = await service.create(createUserDto);
    const passwordHash = user.passwordHash;
    const dto = {
      firstName: 'x',
      lastName: 'y',
      email: 'x.y@mail.com',
      password: void 0,
    };
    const getOneStub = sinon.stub(service, 'getOne');

    getOneStub.withArgs(user.id).returns(user);

    const result = await service.update(user.id, dto);

    getOneStub.restore();

    expect(result.firstName).toBe(dto.firstName);
    expect(result.lastName).toBe(dto.lastName);
    expect(result.email).toBe(dto.email);
    expect(result.passwordHash).toBe(passwordHash);
  });

  it('should not update user', async () => {
    const id = 'wrong-id';
    const getOneStub = sinon.stub(service, 'getOne');

    getOneStub.withArgs(id).returns(null);

    const result = await service.update(id, updateUserDto);

    getOneStub.restore();

    expect(result).toBeUndefined();
  });

  it('should delete user', async () => {
    const id = 'abcd';
    const mock = sinon.mock(Model);

    mock
      .expects('findOneAndDelete')
      .withArgs({ _id: id })
      .resolves(true);

    const result = await service.delete(id);

    mock.verify();
    expect(result).toBe(true);
  });
});
