import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SrsService } from '@app/services/srs.service';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { TranslatingService } from '@app/services/translating.service';
import { Card, Dictionary } from '@app/interfaces/common.interface';

import { untilDestroyed } from 'ngx-take-until-destroy';


@Component({
  selector: 'app-cards-word',
  templateUrl: './cards-word.component.html',
  styleUrls: ['./cards-word.component.scss']
})
export class CardsWordComponent implements OnInit, OnDestroy {

  cardsArray: Dictionary[] = null;
  cards: Dictionary = null;
  checkYourself = false;
  arrIndex = 0;
  endTraining = false;
  endTrainingText = null;
  user_id = 0;
  openModal = false;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor(private srsService: SrsService, private api: ApiService, private snackBar: MatSnackBar,
              private session: SessionService, private translatingService: TranslatingService) { }

  ngOnInit() {
    this.user_id = this.session.user.id;
    const data = 'user_id=' + this.user_id + '&type=word';
    this.api.getAllUserDictionary(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.cardsArray = res.items;

        if (this.cardsArray.length > 0) {
          this.cards = this.cardsArray[0];
        } else {
          this.cards = null;
          this.endTraining = true;
          this.endTrainingText = this.translatingService.translates['confirm'].user_dictionary.finish_all;

          this._isLoaded = true;
        }
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoaded = true;
    });
  }

  ngOnDestroy() {}

  checkButton(action: any) {
    if (action !== 'checkYourself') {
      this._isLoaded = false;

      let card: Card = {
        consecutiveCorrectAnswers: 0,
        due: undefined,
        easeFactor: 0,
        interval: 0,
        reviews: [],
        status: 0
      };

      if (this.cards.workout_progress_card.hasOwnProperty('consecutiveCorrectAnswers')) {
        card = this.cards.workout_progress_card;
      }

      if (action === 2 || action === 3 || action === 4) {
        this.cards.success_training++;
      }
      this.cards.number_training++;

      this.cards.workout_progress_card = this.srsService.processAnswer(card, action);

      this.api.updateUserDictionary(this.cards).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].user_dictionary.saved, null, {duration: 3000});
        } else {
          this.snackBar.open(String(res.error), null, {duration: 3000});
        }

        this._isLoaded = true;
      });

      if (this.arrIndex + 1 < this.cardsArray.length) {
        this.arrIndex++;
        this.checkYourself = false;
        this.cards = this.cardsArray[this.arrIndex];
      } else {
        this.cards = null;
        this.endTraining = true;
        this.endTrainingText = this.translatingService.translates['confirm'].user_dictionary.finish_all;
      }
    } else {
      this.checkYourself = true;
    }
  }

  onChangeMnemonic(status: boolean) {
    this.openModal = status;
  }
}
