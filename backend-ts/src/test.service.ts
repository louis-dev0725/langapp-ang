import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyzeJapaneseService } from './analyze.japanese.service';
import { Content } from './entities/Content';
import { QueueService } from './queue.service';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private analyzeJapanese: AnalyzeJapaneseService,
    private readonly queueService: QueueService,
  ) {}

  async run() {
    //await this.queueService.addToQueue('processContent', { id: 47763 });
    let contentItem = await this.contentRepository.findOne({ where: { id: 125029 } });
    let result = await this.analyzeJapanese.determineLevel(contentItem.cleanText);
    return result;
  }
}
