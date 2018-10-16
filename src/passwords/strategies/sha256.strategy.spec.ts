import { Sha256Strategy } from './sha256.strategy';

describe('Sha256Strategy', () => {
  let strategy: Sha256Strategy;

  beforeEach(() => {
    strategy = new Sha256Strategy();
  });

  it('should hash a password', async () => {
    const password = 'qwerty';
    const hash = await strategy.encrypt(password);

    expect(hash).toBeTruthy();
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
});
