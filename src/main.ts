import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ServerExceptionFilter } from './filter/server-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      // трансформирование входящего json в экзмепляр класса в соответствии с dto
      transform: true,
      // отбрасывание лишних полей (средство борьбы с попытками инъекций)
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ServerExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Kupi Podari Day')
    .setDescription('Kupi Podari Day API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCssUrl: '/swagger/swagger.css',
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
