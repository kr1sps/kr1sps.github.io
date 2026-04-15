import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { EtagInterceptor } from './common/interceptors/etag.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://kr1sps-github-io.onrender.com',
        'https://kr1sps.github.io',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  await app.listen(3000);
}
bootstrap();
