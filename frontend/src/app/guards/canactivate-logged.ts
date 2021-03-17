import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';

@Injectable()
export class CanactivateLogged implements CanActivate, CanActivateChild {
  constructor(private store: Store<fromStore.State>,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let obs = this.store.select(getAuthorizedIsLoggedIn);
    obs.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['auth/signin'], {
          skipLocationChange: true
        });
      }
    })
    return obs;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let obs = this.store.select(getAuthorizedIsLoggedIn);
    obs.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['auth/signin'], {
          skipLocationChange: true
        });
      }
    })
    return obs;
  }
}
