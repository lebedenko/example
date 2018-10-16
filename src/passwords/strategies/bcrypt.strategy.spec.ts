import { BcryptStrategy } from './bcrypt.strategy';

describe('BcryptStrategy', () => {
  let strategy: BcryptStrategy;

  beforeEach(() => {
    strategy = new BcryptStrategy();
  });

  it('should hash a password', async () => {
    const password = 'qwerty';
    const hash = await strategy.encrypt(password);

    expect(hash).toMatch(/^\$2b\$/);
  });

  it('should match a password', async () => {
    const password = 'qwerty';
    const hash = await strategy.encrypt(password);

    expect(await strategy.matches(password, hash)).toBe(true);
  });

  it('should not match a password', async () => {
    const password = 'qwerty';
    const wrongPassword = 'abcde';
    const hash = await strategy.encrypt(password);

    expect(await strategy.matches(wrongPassword, hash)).toBe(false);
  });

  it('should support salt rounds', async () => {
    const pass = new BcryptStrategy({ saltRounds: 8 });
    const hash = await pass.encrypt('abc');

    expect(hash).toMatch(/^\$2b\$08\$/);
  });
});
