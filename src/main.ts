import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { config } from 'process';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GPS API')
    .setVersion('0.0.0.1')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      persistAuthorization: true
    }
  };
  SwaggerModule.setup('swagger', app, document, options);

  await app.listen(3007, '0.0.0.0');

  const logger = new Logger('bootstrap');
  logger.log(`Listening on ${await app.getUrl()}/swagger`);
}
bootstrap();
