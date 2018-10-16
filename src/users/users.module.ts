import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PasswordsModule } from '../passwords/passwords.module';
import { PasswordStrategy } from '../passwords/interfaces/password-strategy.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    PasswordsModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'passwordStrategy',
      useFactory: (strategy: PasswordStrategy) => strategy,
      inject: ['PASSWORD_BCRYPT'],
    },
  ],
})
export class UsersModule {}
