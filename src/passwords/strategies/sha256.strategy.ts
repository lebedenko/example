import * as crypto from 'crypto';

import { PasswordStrategy } from '../interfaces/password-strategy.interface';

export class Sha256Strategy implements PasswordStrategy {
  async encrypt(password: string): Promise<string> {
    const hashObject = crypto.createHash('sha256');

    hashObject.update(password);
    return hashObject.digest('hex');
  }

  async matches(password: string, hash: string): Promise<boolean> {
    const hashObject = crypto.createHash('sha256');

    hashObject.update(password);
    return hashObject.digest('hex') === hash;
  }
}
