import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { EtagInterceptor } from './common/interceptors/etag.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Backlabs API')
    .setDescription('API для интернет-магазина')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('products')
    .addTag('categories')
    .addTag('auth')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new TimingInterceptor(), new EtagInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
