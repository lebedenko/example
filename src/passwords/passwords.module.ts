import { Module } from '@nestjs/common';

import { passwordsProviders } from './passwords.providers';

@Module({
  providers: [...passwordsProviders],
  exports: [...passwordsProviders],
})
export class PasswordsModule {}
