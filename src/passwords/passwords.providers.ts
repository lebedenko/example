import { BcryptStrategy } from './strategies/bcrypt.strategy';
import { Sha256Strategy } from './strategies/sha256.strategy';

export const passwordsProviders = [
  {
    provide: 'PASSWORD_BCRYPT',
    useClass: BcryptStrategy,
  },
  {
    provide: 'PASSWORD_SHA256',
    useClass: Sha256Strategy,
  },
];
