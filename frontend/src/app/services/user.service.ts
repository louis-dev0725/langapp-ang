import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { User } from '../interfaces/common.interface';

@Injectable({ providedIn: 'root' })
export class UserService extends EntityCollectionServiceBase<User> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('User', serviceElementsFactory);
    }

    public getMe() {
        return this.getByKey("me");
    }
}