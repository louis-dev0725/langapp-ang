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
  selector: 'app-cards-kanji',
  templateUrl: './cards-kanji.component.html',
  styleUrls: ['./cards-kanji.component.scss']
})
export class CardsKanjiComponent implements OnInit, OnDestroy {

  cardsArray: Dictionary[] = null;
  cards: Dictionary = null;
  checkYourself = false;
  arrIndex = 0;
  endTraining = false;
  endTrainingText = null;

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
    const data = 'user_id=' + this.session.user.id + '&type=kanji&sort=cardsKanji';
    this.api.getAllUserDictionary(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.cardsArray = res.items;
        this.editCardElem(this.cardsArray);
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }
    });
  }

  editCardElem(elements) {
    elements.forEach((element) => {
      const query = 'user_id=' + this.session.user.id + '&word=' + element.original_word;
      this.api.getQueryUserDictionary(query).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          element.words = res.items;
        } else {
          this.snackBar.open(String(res.error), null, {duration: 3000});
        }

        this._isLoaded = true;
      });

      element.word_on = '';
      element.word_kun = '';
      element.word_translate = '';

      if (element.dictionaryWord.sourceData.readings.ja_on.length > 0) {
        element.word_on += element.dictionaryWord.sourceData.readings.ja_on.join(', ');
      }

      if (element.dictionaryWord.sourceData.readings.ja_kun.length > 0) {
        element.word_kun += element.dictionaryWord.sourceData.readings.ja_kun.join(', ');
      }

      const meanArr = Object.entries(element.dictionaryWord.sourceData.meanings);
      if (meanArr.length > 0) {
        meanArr.forEach((mean) => {
          mean.forEach((lang, l) => {
            if (l === 1) {
              // @ts-ignore
              element.word_translate += lang.join(', ') + ', ';
              if (l === mean.length - 1) {
                // @ts-ignore
                element.word_translate += lang.join(', ');
              }
            }
          });
        });
      }
    });
    this.cards = elements[0];
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

      if (this.cards.workout_progress_card.cardsKanji.hasOwnProperty('consecutiveCorrectAnswers')) {
        card = this.cards.workout_progress_card.cardsKanji;
      }

      if (action === 3 || action === 4) {
        this.cards.success_training++;
      }
      this.cards.number_training++;

      this.cards.workout_progress_card.cardsKanji = this.srsService.processAnswer(card, action);

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
        this.endTrainingText = this.translatingService.translates['confirm'].user_dictionary.finish_kanji;
      }
    } else {
      this.checkYourself = true;
    }
  }
}
