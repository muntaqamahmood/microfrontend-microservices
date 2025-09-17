import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TasksModule } from './tasks.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TasksModule, {
    transport: Transport.GRPC,
    options: {
      package: 'tasks',
      protoPath: join(__dirname, 'tasks.proto'),
      url: process.env.GRPC_URL || '0.0.0.0:50051',
    },
  });
  await app.listen();
  console.log('Tasks gRPC service running on 0.0.0.0:50051');
}
bootstrap();
