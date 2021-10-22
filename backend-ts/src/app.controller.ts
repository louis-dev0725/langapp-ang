import { Controller, Get, Param, Body, Post, HttpCode } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { text } from 'express';
import { url } from 'inspector';
import { AppService } from './app.service';
import { QueueService } from './queue.service';
import { TestService } from './test.service';

export class ProcessTextBody {
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  @IsNumber()
  offset: number;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  languages: string[];
  exactMatch = false;
}

export class AddToQueueBody {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  params: any;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queueService: QueueService,
    private readonly testService: TestService,
  ) { }

  @Post("addToQueue")
  @HttpCode(200)
  async addToQueue(@Body() params: AddToQueueBody) {
    return await this.queueService.addToQueue(params.name, params.params);
  }

  @Get("test")
  @HttpCode(200)
  async test() {
    return await this.testService.run();
  }

  @Get("probeBackendTs")
  @HttpCode(200)
  async probe() {
    return true;
  }

  @Post("processText")
  @HttpCode(200)
  async processText(@Body() params: ProcessTextBody): Promise<any> {
    //let request = { "all_text": "          \n        \n      \n      \n\n        \n          \n            \n            \n              ５Ｇを使った運転手がいないタクシー　安全かどうか実験を行う\n            \n            [11月6日 16時15分]\n            \n              \n       ", "url": "https://www3.nhk.or.jp/news/easy/k10012696711000/k10012696711000.html", "offset": 100 };
    //request = { "all_text": "使っていました", offset: 6, url: "" };
    //request = { "all_text": "ＫＤＤＩなど５つの会社は、「５Ｇ」を使った自動運転のタクシーが安全に走ることができるか実験を行いました。東京都の副知事たちが乗ったタクシーが、運転手がいないまま新宿の道を２００ｍぐらい走りました。", offset: 24, url: "" };

    console.log(params);

    return await this.appService.processText(params.text, params.offset, params.languages, params.exactMatch);
  }
}
