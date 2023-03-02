import { Controller, Get, Logger, Param, Query, Req, Res, UseGuards } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, mkdirSync } from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaidGuard } from 'src/auth/paid.guard';
import { RequestWithUser } from 'src/auth/RequestWithUser';
import { Audio } from 'src/entities/Audio';
import { Repository } from 'typeorm';
import { AzureConfig, SpeechAzure } from './SpeechAzure';
import * as crypto from 'crypto';
import { isFileExists } from 'src/utils';
import * as fs from 'fs';
import { SpeechAmazon } from './SpeechAmazon';
import { SpeechInterface } from './SpeechInterface';

@Controller('audio')
export class AudioController {
  private readonly logger = new Logger(AudioController.name, { timestamp: true });

  public audioDir: string;

  public speechServices: Record<string, SpeechInterface> = {
    amazon: null,
    azure: null,
  };

  public voices = {
    amazon: ['Takumi'],
    azure: ['ja-JP-KeitaNeural', 'ja-JP-NanamiNeural'],
  };

  constructor(
    @InjectRepository(Audio)
    private audioRepository: Repository<Audio>,
  ) {
    this.audioDir = path.normalize(`${__dirname}/../../../backend/web/upload/audio/`);
    mkdirSync(this.audioDir, { recursive: true });

    if (process.env.AZURE_SPEECH_KEY) {
      let azureConfig: AzureConfig = {
        serviceRegion: process.env.AZURE_SPEECH_REGION || 'westeurope',
        speechSubscriptionKey: process.env.AZURE_SPEECH_KEY,
      };
      this.speechServices.azure = new SpeechAzure(azureConfig);
    }

    if (process.env.AWS_ACCESS_KEY_ID) {
      this.speechServices.amazon = new SpeechAmazon({ region: process.env.AWS_REGION || 'eu-central-1' });
    }
  }

  //   @UseGuards(JwtAuthGuard, PaidGuard)
  @Get('')
  async getItem(@Req() req: RequestWithUser, @Query() query, @Res() res: any) {
    if (!query?.q) {
      return this.returnEmptyAudio(res);
    }

    let text = Buffer.from(query?.q, 'base64').toString('utf-8');

    if (text.length > 300) {
      return this.returnEmptyAudio(res);
    }

    console.log('Request audio for ', text);

    let audio = await this.getAudioForText(text);
    if (audio) {
      let filePath = this.audioDir + audio.file;
      if (await isFileExists(filePath)) {
        let stream = createReadStream(filePath);
        res.header('Content-Type', 'audio/mpeg');
        res.header('Cache-Control', 'max-age=604800');
        res.send(stream);
        return;
      }
    }

    return this.returnEmptyAudio(res);
  }

  returnEmptyAudio(res: any) {
    res.header('Content-Type', 'audio/wav');
    res.send(Buffer.from('UklGRiIBAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTkuMTYuMTAwAGRhdGHcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==', 'base64'));
  }

  async getAudioForText(text: string): Promise<Audio> {
    let existingAudioList = await this.audioRepository.find({
      where: {
        text: text,
      },
    });
    if (existingAudioList.length == 0) {
      let newAudio = new Audio();
      newAudio.addedDateTime = new Date();
      newAudio.lang = 'ja-JP';
      newAudio.text = text;
      //   newAudio.voice = 'ja-JP-KeitaNeural'; // ja-JP-NanamiNeural
      newAudio.voice = 'Takumi';
      newAudio.file = this.generateFilename(newAudio);

      if (!(await this.generateNewAudio(newAudio.text, 'ja-JP', newAudio.voice, this.audioDir + newAudio.file))) {
        return null;
      }

      await newAudio.save();

      return newAudio;
    } else {
      return existingAudioList[0];
    }
  }

  async generateNewAudio(text: string, language: string, voice: string, toFile: string) {
    let service = null;
    for (let [i, voiceList] of Object.entries(this.voices)) {
      if (voiceList.indexOf(voice) !== -1) {
        service = i;
        break;
      }
    }
    if (service == null || !this.speechServices[service]) {
      this.logger.warn(`AudioController: No key for service ${service}`);
      return false;
    }

    let isSsml = text[0] == '<';
    let speakTextInput = {
      language: language,
      voiceName: voice,
      text: text,
      textType: isSsml ? ('ssml' as const) : ('text' as const),
    };
    await fs.promises.mkdir(path.dirname(toFile), { recursive: true });

    console.log('Generate audio');
    await this.speechServices[service].speakTextToFile(speakTextInput, toFile);
    console.log('Done');

    return true;
  }

  generateFilename(audio: Audio) {
    let filename = this.hashString(JSON.stringify({ text: audio.text, voice: audio.voice }));
    return filename.slice(0, 5) + '/' + filename + '.mp3';
  }

  hashString(string: string) {
    return crypto.createHash('sha256').update(string).digest('hex');
  }
}
