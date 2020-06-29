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
  user_id = 0;
  openModal = false;
  // @ts-ignore
  domain = window.rocket.apiHost;

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
    const data = 'user_id=' + this.user_id + '&type=kanji';
    this.api.getAllUserDictionary(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.cardsArray = res.items;

        if (this.cardsArray.length > 0) {
          this.getOtherInfoElement(this.cardsArray);
        } else {
          this.cards = null;
          this.endTraining = true;
          this.endTrainingText = this.translatingService.translates['confirm'].user_dictionary.finish_all;

          this._isLoaded = true;
        }
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }
    });
  }

  getOtherInfoElement(elements) {
    let words = null;
    let mnemonic = null;
    elements.forEach((element) => {
      if (element.type === 1) {
        if (words === null) {
          words = element.original_word;
        } else {
          words += ',' + element.original_word;
        }
      }
      if (mnemonic === null) {
        mnemonic = element.original_word;
      } else {
        mnemonic += ',' + element.original_word;
      }
    });

    const query = 'user_id=' + this.user_id + '&word=' + words + '&mnemonic=' + mnemonic;
    this.api.getQueryUserDictionary(query).pipe(untilDestroyed(this)).subscribe((res) => {
      if (!(res instanceof ApiError)) {
        this.editCardElem(this.cardsArray, res);
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoaded = true;
    });
  }

  editCardElem(elements, result) {
    elements.forEach((element) => {
      element.mnemonic_all = [];

      if (result.mnemonics.length > 0) {
        if (element.mnemonic_id === null) {
          element.mnemonic = result.mnemonics[0];
          element.mnemonic_id = result.mnemonics[0].id;
        }
        result.mnemonics.forEach((mnemonic) => {
          if (mnemonic.word === element.original_word) {
            const idx_rating = mnemonic.mnemonicsUsers.findIndex(item => item.users_id === this.user_id);
            mnemonic.user_rating = null;
            if (idx_rating !== -1) {
              mnemonic.user_rating = mnemonic.mnemonicsUsers[idx_rating].rating;
            }
            element.mnemonic_all.push(mnemonic);
          }
        });
      }

      element.word_on = '';
      element.word_kun = '';
      element.word_translate = '';

      if (result.words.length > 0) {
        element.words = [];
        result.words.forEach((word) => {
          if (word.original_word.indexOf(element.original_word) !== -1) {
            element.words.push(word);
          }
        });
      }

      if (result.mnemonics.length > 0) {
        if (element.mnemonic_id === null) {
          element.mnemonic = result.mnemonics[0];
        }
        result.mnemonics.forEach((mnemonic) => {
          if (mnemonic.word === element.original_word) {
            element.mnemonic_all = mnemonic;
          }
        });
      }

      if (element.dictionaryWord.sourceData.readings.ja_on) {
        if (element.dictionaryWord.sourceData.readings.ja_on.length > 0) {
          element.word_on += element.dictionaryWord.sourceData.readings.ja_on.join(', ');
        }
      }

      if (element.dictionaryWord.sourceData.readings.ja_kun) {
        if (element.dictionaryWord.sourceData.readings.ja_kun.length > 0) {
          element.word_kun += element.dictionaryWord.sourceData.readings.ja_kun.join(', ');
        }
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
        due: 0,
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

  onEnterMnemonic(id: number) {
    const mnemonicIndex = this.cards.mnemonic_all.findIndex(item => item.id === id);
    const mnemonic = this.cards.mnemonic_all[mnemonicIndex];

    this.cards.mnemonic = mnemonic;
    this.cards.mnemonic_id = mnemonic.id;
  }
}
