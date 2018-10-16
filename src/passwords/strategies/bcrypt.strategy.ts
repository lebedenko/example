import * as bcrypt from 'bcrypt';

import { PasswordStrategy } from '../interfaces/password-strategy.interface';

export class BcryptStrategy implements PasswordStrategy {
  private saltRounds = 12;

  constructor(options?: any) {
    if (options && options.saltRounds) {
      this.saltRounds = +options.saltRounds;
    }
  }

  encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  matches(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
