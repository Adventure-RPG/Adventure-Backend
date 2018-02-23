import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {DatabaseModule} from './modules/database/database.module';
import {AuthModule} from './modules/auth/auth.module';

@Module({
  imports: [],
  controllers: [
    AppController,
  ],
  modules: [
    DatabaseModule,
    AuthModule,
  ]
})
export class ApplicationModule {}
