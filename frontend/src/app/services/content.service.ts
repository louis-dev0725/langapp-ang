import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Content } from '../interfaces/common.interface';

@Injectable({ providedIn: 'root' })
export class ContentService extends EntityCollectionServiceBase<Content> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Content', serviceElementsFactory);
    }
}