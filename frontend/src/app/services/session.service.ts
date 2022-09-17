import { Injectable } from '@angular/core';
import { User } from '@app/interfaces/common.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public user$ = new BehaviorSubject<User>(null);
  public token$ = new BehaviorSubject<string>(null);
  public lang$ = new BehaviorSubject<string>(null);

  constructor() {}

  get isAdmin(): boolean {
    return this.user$.value?.isAdmin ?? false;
  }

  get language(): string {
    return this.lang$.value;
  }
}
