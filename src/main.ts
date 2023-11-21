import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage } from '../proto/question.pb';
import { RPCExceptionFilter } from './exception-handler.filter';
import { LanguageHandler } from './language-handler';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:5003',
      package: protobufPackage,
      protoPath: join('node_modules/questr-proto/proto/question.proto'),
    },
  });

  app.useGlobalInterceptors(new LanguageHandler());

  app.useGlobalFilters(new RPCExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, enableDebugMessages: true }));

  await app.listen();
}
bootstrap();
 