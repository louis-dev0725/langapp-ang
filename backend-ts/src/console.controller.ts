import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Command, Console } from "nestjs-console";
import { IsNull, Not, Repository } from "typeorm";
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
        command: 'reprocessAllContent',
        description: 'Reprocess all content.'
    })
    async reprocessAllContent() {
        let offset = 0;
        let limit = 10000;
        do {
            let items = await this.contentRepository.find({
                where: {
                    cleanText: Not(IsNull())
                    //id: 3315,
                },
                order: {
                    id: 'ASC'
                },
                take: limit,
                skip: offset
            });
            console.log('Loaded', items.length, 'items');
            if (items.length == 0) {
                break;
            }
            for (let item of items) {
                await this.queueService.addToQueue('processContent', { id: item.id });
            }
            offset += limit;
            break;
        } while (true);
        console.log('Finished');
    }
}