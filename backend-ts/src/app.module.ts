import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryWord } from './entities/DictionaryWord';
import { FormDetection } from './form.detection';
import { JumanppJumandicClient } from './proto/jumandic-svc_grpc_pb';
import { credentials as grpcCredentials } from 'grpc';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [DictionaryWord],
      autoLoadEntities: false
    }),
    TypeOrmModule.forFeature([DictionaryWord])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FormDetection,
    {
      provide: JumanppJumandicClient,
      useValue: new JumanppJumandicClient('localhost:51231', grpcCredentials.createInsecure()),
    }
  ],
})
export class AppModule { }
