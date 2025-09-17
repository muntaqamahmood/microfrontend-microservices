import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CommentsModule } from './comments.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CommentsModule, {
    transport: Transport.GRPC,
    options: {
      package: 'comments',
      protoPath: join(__dirname, 'comments.proto'),
      url: process.env.GRPC_COMMENTS_URL || '0.0.0.0:50052',
    },
  });
  await app.listen();
  console.log('Comments gRPC service running on 0.0.0.0:50052');
}
bootstrap(); 