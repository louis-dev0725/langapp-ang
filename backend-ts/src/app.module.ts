import { Global, Module } from '@nestjs/common';
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
import { AnalyzeJapaneseService } from './analyze.japanese.service';
import { TestService } from './test.service';
import { DictionaryWordRepository } from './entities/DictionaryWordRepository';
import { BackgroundModule } from './background/background.module';
import { DrillsController } from './drills/drills.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/User';
import { UserDictionary } from './entities/UserDictionary';
import { Sentence } from './entities/Sentence';
import { AudioController } from './audio/audio.controller';
import { Audio } from 'src/entities/Audio';
import { SrsService } from './drills/srs.service';
import { DrillReview } from './entities/DrillReview';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [DictionaryWord, Content, User, UserDictionary, Sentence, Audio, DrillReview],
      autoLoadEntities: false,
    }),
    TypeOrmModule.forFeature([DictionaryWord, Content, UserDictionary, Sentence, Audio, DrillReview]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_SERVICE_HOST || 'redis',
        port: parseInt(process.env.REDIS_SERVICE_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'backgroundTasks',
    }),
    ConsoleModule,
    BackgroundModule,
    AuthModule,
  ],
  controllers: [AppController, DrillsController, AudioController],
  providers: [
    AppService,
    QueueService,
    FormDetection,
    {
      provide: JumanppJumandicClient,
      useValue: new JumanppJumandicClient('localhost:51231', grpcCredentials.createInsecure()),
    },
    ConsoleController,
    AnalyzeJapaneseService,
    TestService,
    SrsService,
    DictionaryWordRepository,
  ],
  exports: [ConsoleController, AnalyzeJapaneseService],
})
export class AppModule {}
