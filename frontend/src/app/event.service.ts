import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  emitter: EventEmitter<any> = new EventEmitter<any>();

  emitChangeEvent(data: any) {
    this.emitter.next(data);
  }
}
