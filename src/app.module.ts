import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';

const connectionOptions = {
  useNewUrlParser: true,
  keepAlive: 30000,
  connectTimeoutMS: 30000,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
};

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/test', connectionOptions),
    UsersModule,
  ],
})
export class AppModule {}
