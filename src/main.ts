import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api/v1');

	const config = new DocumentBuilder()
		.setTitle('Koala Task Manager')
		.setDescription('The Koala API description')
		.setVersion('1.0')
		.addTag('Koala API')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	app.enableCors();
	await app.listen(4200);
}
bootstrap();
