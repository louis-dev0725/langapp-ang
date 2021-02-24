import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('backgroundTasks') public queue: Queue
    ) {
    }

    async addToQueue(name: string, params: any) {
        return await this.queue.add(name, params);
    }
}