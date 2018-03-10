import {Global, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import {DatabaseModule} from './modules/database/database.module';
import {AuthModule} from './modules/auth/auth.module';
import {appProviders} from './providers/app.providers';

@Global()
@Module({
  imports: [],
  components: [...appProviders],
  controllers: [
    AppController,
  ],
  modules: [
    DatabaseModule,
    AuthModule,
  ],
  exports: [...appProviders],
})
export class ApplicationModule {}
