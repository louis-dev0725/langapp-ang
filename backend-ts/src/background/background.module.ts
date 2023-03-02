import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzeJapaneseService } from 'src/analyze.japanese.service';
import { Content } from 'src/entities/Content';
import { DictionaryWord } from 'src/entities/DictionaryWord';
import { DictionaryWordRepository } from 'src/entities/DictionaryWordRepository';
import { QueueProcessor } from './queue.processor';

let providers: Provider[] = [DictionaryWordRepository];
if ((<any>global).useQueueProcessor) {
  providers.push(QueueProcessor);
}

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryWord, Content])],
  providers: providers,
})
export class BackgroundModule {}
