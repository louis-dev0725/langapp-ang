import { Processor, Process, OnQueueError, OnQueueFailed } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import { Content } from '../entities/Content';
import { Cue, parseWebVTT, WebVTT } from '../webvtt';
import { groupBy, values } from 'lodash';
import { median } from '../utils';
import { removeJapaneseChars } from '../japanese.utils';
import { AnalyzeJapaneseService } from '../analyze.japanese.service';

@Injectable()
@Processor('backgroundTasks')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name, { timestamp: true });

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private analyzeJapanese: AnalyzeJapaneseService,
  ) {}

  @Process({ name: 'processContent', concurrency: 10 })
  async processContent(job: Job<any>) {
    let item = await this.contentRepository.findOne({ where: { id: job.data.id } });
    if (!item) {
      throw new Error('Unable to find content item with id ' + job.data.id);
    }
    try {
      //this.logger.log('Process content item #' + item.id);
      console.log('Process content item #' + item.id);
      delete item.dataJson.subtitlesPace;

      let lang = 'ja';

      if (item.format == 'webvtt') {
        let webvtt: WebVTT;
        try {
          webvtt = parseWebVTT(item.text);
        } catch (e) {
          throw new Error('Unable to parse WebVTT. Error: ' + (e.stack ?? e));
        }
        if (!webvtt.valid) {
          throw new Error('webvtt is not valid');
        }
        if (webvtt.cues.length < 5) {
          throw new UnpublishedReason('Less than 5 subtitle lines.');
        }

        item.cleanText = webvtt.cues.map((c) => c.text).join('\n');
        if (item.dataJson.duration) {
          item.dataJson.subtitlesPaceMedian = this.calculateMedianSubtitlesPace(webvtt.cues, item.dataJson.duration, lang);
          item.dataJson.subtitlesPaceOverall = this.calculateOverallSubtitlesPace(item.cleanText, item.dataJson.duration, lang);
          item.dataJson.subtitlesCoverage = this.calculateSubtitlesCoverage(webvtt.cues, item.dataJson.duration);
        }

        if (lang == 'ja') {
          await this.analyzeJapanese.fillLevelForContent(item);
          this.filterJapaneseSubtitles(item);
        }

        if (item.dataJson?.youtubeVideo?.viewCount) {
          if (item.dataJson.youtubeVideo.viewCount < 100) {
            throw new UnpublishedReason('View count < 100.');
          }
          if (item.dataJson.youtubeVideo.viewCount < 1000 && item.dataJson.youtubeVideo?.averageRating && item.dataJson.youtubeVideo?.averageRating > 0 && item.dataJson.youtubeVideo?.averageRating < 3) {
            throw new UnpublishedReason('View count < 1000 and averageRating < 3.');
          }
        }
      } else {
        item.cleanText = item.text;

        if (lang == 'ja') {
          await this.analyzeJapanese.fillLevelForContent(item);
        }
      }

      item.dataJson = item.dataJson;
      item.length = item.cleanText.length;
      item.status = 1;

      delete item.dataJson.errorInternal;
      delete item.dataJson.unpublishedReason;
    } catch (e) {
      if (e instanceof UnpublishedReason) {
        item.status = -1;
        item.dataJson.unpublishedReason = e.message;
      } else {
        item.status = -2;
        item.dataJson.errorInternal = e.stack;
      }
    }

    await this.contentRepository.save(item);

    return {};
  }

  filterJapaneseSubtitles(item: Content) {
    if (item.dataJson.subtitlesPaceMedian !== undefined && item.dataJson.subtitlesPaceOverall !== undefined) {
      if (item.dataJson.subtitlesPaceMedian > 900) {
        throw new UnpublishedReason('Subtitles median pace is too high (possible due to duplicate lines in subtitles).');
      }
      if (item.dataJson.subtitlesPaceOverall > 2000) {
        throw new UnpublishedReason('Subtitles overall pace is too high (possible due to duplicate lines in subtitles).');
      }
      if (item.dataJson.subtitlesPaceMedian < 50) {
        // TODO: change to 30 after adding filter using STT
        throw new UnpublishedReason('Subtitles median pace is too low (possible video is not fully subtitled).');
      }
      if (item.dataJson.subtitlesPaceOverall < 50) {
        throw new UnpublishedReason('Subtitles overall pace is too low (possible video is not fully subtitled).');
      }
    }
    let nonJapaneseChars = removeJapaneseChars(item.cleanText);
    if (nonJapaneseChars.length / item.cleanText.length > 0.8) {
      throw new UnpublishedReason('Subtitles not in Japanese.');
    }
    if (nonJapaneseChars.length / item.cleanText.length > 0.45) {
      throw new UnpublishedReason('More than 45% of subtitles not in Japanese.');
    }
  }

  cleanTextForSubtitlesPace(text: string, lang: string) {
    if (lang == 'ja') {
      text = text.replace(/\s+/g, '');
      text = text.replace(/([a-zA-Z])[a-zA-Z][a-zA-Z]?/g, '$1'); // Calculate English letters as ~33%
    }

    return text;
  }

  calculateMedianSubtitlesPace(cues: Cue[], duration: number, lang: string) {
    if (cues.length == 0) {
      return 0;
    }
    let groupedBy30seconds = groupBy(cues, (c) => Math.floor(c.start / 30));
    // Add groups/periods without subtitles
    for (let s = 0; s < Math.floor(duration / 30); s++) {
      if (!groupedBy30seconds[s]) {
        groupedBy30seconds[s] = [];
      }
    }
    return median(values(groupedBy30seconds).map((a) => a.map((c) => this.cleanTextForSubtitlesPace(c.text, lang)).join('').length)) * 2;
  }

  calculateOverallSubtitlesPace(cleanText: string, duration: number, lang: string) {
    return Math.floor((this.cleanTextForSubtitlesPace(cleanText, lang).length / duration) * 60);
  }

  calculateSubtitlesCoverage(cues: Cue[], duration: number) {
    if (cues.length == 0) {
      return 0;
    }
    let coverage: boolean[] = [];
    for (let cue of cues) {
      for (let s = Math.floor(cue.start); s <= Math.min(duration, Math.ceil(cue.end)); s++) {
        coverage[s] = true;
      }
    }
    let coveredSeconds = coverage.filter((c) => c === true).length;

    return Math.floor((coveredSeconds / duration) * 100);
  }

  @OnQueueFailed()
  onFailed(job: Job, e: Error) {
    this.logger.error(`Error when processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}: ${e.stack ?? e}`);
  }
}

class UnpublishedReason extends Error {}
