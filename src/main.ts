import * as express from 'express';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {AppLogger} from './app.logger';
import * as path from 'path';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, {
		logger: new AppLogger(),
	});
	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'pug');

	app.setGlobalPrefix('api/v1');
	await app.listen(3000);
}
bootstrap();
