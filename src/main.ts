import * as express from 'express';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {AppLogger} from './app.logger';
import * as path from 'path';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule, {
		logger: new AppLogger(),
	});
	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'pug');

	app.setGlobalPrefix('api/v1');

	const options = new DocumentBuilder()
		.setTitle('Game authorization')
		.setDescription('Game authorization API')
		.setVersion('0.1')
		.addTag('auth')
		.addBearerAuth('Bearer', 'header')
        .setBasePath('api/v1')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('/api/swagger', app, document);

	await app.listen(3000);
}
bootstrap();
