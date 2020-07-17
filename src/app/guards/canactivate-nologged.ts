import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/index';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';
import { map } from 'rxjs/operators';

@Injectable()
export class CanactivateNologged implements CanActivate {
  constructor(private store: Store<fromStore.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(getAuthorizedIsLoggedIn).pipe(map((isLoggedIn) => !isLoggedIn));
  }
}
