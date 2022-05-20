import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CardsService } from '@app/training/cards/cards.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EndingGuard implements CanActivate {
  constructor(private cardService: CardsService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.cardService.getEndingMessage().pipe(
      map((message) => {
        if (message) {
          return true;
        }
        return this.router.createUrlTree(['training/audio-for-word']);
      })
    );
  }
}
