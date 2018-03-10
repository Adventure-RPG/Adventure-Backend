import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import {AppLogger} from './app.logger';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, {
		logger: new AppLogger(),
	});
	await app.listen(3000);
}
bootstrap();
