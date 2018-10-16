import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { UserSchema } from './user.schema';
import { User } from '../interfaces/user.interface';

describe('User schema', () => {
  const UserModel: Model<User> = mongoose.model('User', UserSchema);

  it('should pass validation', () => {
    const user: User = new UserModel({
      email: 'some@email.com',
      passwordHash: '123',
    });

    user.validate(err => {
      expect(err).toBeNull();
    });
  });

  it('should have validation error if email is empty', () => {
    const user: User = new UserModel();

    user.validate(err => {
      expect(err.errors.email).toBeTruthy();
    });
  });
});
