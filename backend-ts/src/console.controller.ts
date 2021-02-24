import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Command, Console } from "nestjs-console";
import { IsNull, Like, Not, Repository } from "typeorm";
import { AnalyzeJapaneseService } from "./analyze.japanese.service";
import { Content } from "./entities/Content";
import { QueueService } from "./queue.service";

@Injectable()
@Console()
export class ConsoleController {
    constructor(
        @InjectRepository(Content)
        private contentRepository: Repository<Content>,
        private readonly queueService: QueueService
    ) {
    }

    @Command({
        command: 'emptyQueue',
        description: 'Empty queue (waiting tasks).'
    })
    async emptyQueue() {
        await this.queueService.queue.empty();
    }

    @Command({
        command: 'cleanQueue',
        description: 'Clean queue (all tasks).'
    })
    async cleanQueue() {
        let queue = this.queueService.queue;
        await queue.pause(true).then(function () {
            return queue.clean(0, 'completed');
        }).then(function () {
            return queue.clean(0, 'active');
        }).then(function () {
            return queue.clean(0, 'delayed');
        }).then(function () {
            return queue.clean(0, 'failed');
        }).then(function () {
            return queue.empty();
        });
    }

    @Command({
        command: 'processQueue',
    })
    async processQueue() {
        console.log('Start processQueue');
        setInterval(() => { });
        await new Promise(() => {
            // Promise never resolved
        });
    }

    @Command({
        command: 'reprocessAllContent',
        description: 'Reprocess all content.'
    })
    async reprocessAllContent() {
        let offset = 0;
        let limit = 5000;
        let first = null;
        let last = null;
        do {
            let items = await this.contentRepository.find({
                select: ['id'],
                where:
                    [
                        {
                            level: 5,
                            //cleanText: Not(IsNull())
                            //id: 3315,
                            //level: -1,
                            //status: -2,
                        }],
                order: {
                    id: 'ASC'
                },
                take: limit,
                skip: offset
            });
            console.log('Offset', offset, 'Loaded', items.length, 'items');
            if (items.length == 0) {
                break;
            }
            let jobs = [];
            for (let itemTmp of items) {
                let id = itemTmp.id;
                jobs.push({ name: 'processContent', data: { id: id } });
            }

            await this.queueService.queue.addBulk(jobs);
            offset += limit;
        } while (true);
        console.log('Finished');
    }

    @Command({
        command: 'test',
        description: ''
    })
    async test() {
    }
}