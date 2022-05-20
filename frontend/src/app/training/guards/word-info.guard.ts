import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CardsService } from '@app/training/cards/cards.service';
import { map } from 'rxjs/operators';
import {ApiService} from "@app/services/api.service";

@Injectable({
  providedIn: 'root',
})
export class WordInfoGuard implements CanActivate {
  constructor(private cardService: CardsService, private router: Router, private api: ApiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.cardService.getTrainingCards().pipe(
      map((cards) => {
        let cardType;
        if (cards) {
          for (const [key, card] of Object.entries(cards)) {
            if (key === `wordInfo_${route.params.id}`) {
              cardType = card;
              this.cardService.setCurrentWord(cardType.value);
              this.cardService.setCurrentCard(card);
            }
          }
          if (!cardType) {
            this.api.getTrainingCardById(route.params.id)
              .subscribe(response => {
                this.cardService.setCurrentCard(response);
              });
          }
          return true;
        }
        return this.router.createUrlTree(['training/index']);
      })
    );
  }
}
