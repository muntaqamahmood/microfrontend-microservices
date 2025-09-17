import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TasksController } from './tasks.controller';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASKS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'tasks',
          protoPath: join(__dirname, 'tasks.proto'),
          url: process.env.GRPC_URL || 'localhost:50051',
        },
      },
      {
        name: 'COMMENTS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'comments',
          protoPath: join(__dirname, 'comments.proto'),
          url: process.env.GRPC_COMMENTS_URL || 'localhost:50052',
        },
      },
    ]),
  ],
  controllers: [TasksController, CommentsController],
})
export class AppModule {}
