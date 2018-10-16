export interface PasswordStrategy {
  encrypt: (password: string) => Promise<string>;
  matches: (password: string, hash: string) => Promise<boolean>;
}
