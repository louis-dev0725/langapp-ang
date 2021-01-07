import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryWord } from './entities/DictionaryWord';
import { FormDetection } from './form.detection';
import { JumanppJumandicClient } from './proto/jumandic-svc_grpc_pb';
import { credentials as grpcCredentials } from 'grpc';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { ConsoleModule } from 'nestjs-console';
import { ConsoleController } from './console.controller';
import { Content } from './entities/Content';
import { QueueProcessor } from './queue.processor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [DictionaryWord, Content],
      autoLoadEntities: false
    }),
    TypeOrmModule.forFeature([DictionaryWord, Content]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'backgroundTasks',
    }),
    ConsoleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    QueueService,
    FormDetection,
    {
      provide: JumanppJumandicClient,
      useValue: new JumanppJumandicClient('localhost:51231', grpcCredentials.createInsecure()),
    },
    ConsoleController,
    QueueProcessor,
  ],
  exports: [
    ConsoleController
  ],
})
export class AppModule { }
