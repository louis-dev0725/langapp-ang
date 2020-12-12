import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SrsService } from '@app/services/srs.service';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { TranslatingService } from '@app/services/translating.service';
import { Card, Dictionary } from '@app/interfaces/common.interface';

import { ModalMnemonicComponent } from '@app/training/modal-mnemonic/modal-mnemonic.component';

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
  @ViewChild(ModalMnemonicComponent) mmc: ModalMnemonicComponent;

  constructor(private srsService: SrsService, private api: ApiService, private snackBar: MatSnackBar,
              private session: SessionService, private translatingService: TranslatingService) { }

  ngOnInit() {
    this.user_id = this.session.user.id;
    const data = 'user_id=' + this.user_id + '&type=word';
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
        this._isLoaded = true;
      }
    });
  }

  getOtherInfoElement(elements) {
    let mnemonic = null;
    elements.forEach((element) => {
      if (mnemonic === null) {
        mnemonic = element.original_word;
      } else {
        mnemonic += ',' + element.original_word;
      }
    });

    const query = 'user_id=' + this.user_id + '&mnemonic=' + mnemonic;
    this.api.getMnemonics(query).pipe(untilDestroyed(this)).subscribe((res) => {
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
        result.mnemonics.forEach((mnemonic) => {
          if (mnemonic.word === element.original_word) {
            if (element.mnemonic_id === null) {
              element.mnemonic = mnemonic;
              element.mnemonic_id = mnemonic.id;
            }

            const idx_rating = mnemonic.mnemonicsUsers.findIndex(item => item.users_id === this.user_id);
            mnemonic.user_rating = null;
            if (idx_rating !== -1) {
              mnemonic.user_rating = mnemonic.mnemonicsUsers[idx_rating].rating;
            }
            element.mnemonic_all.push(mnemonic);
          }
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

  openCreateMnemonicModal() {
    this.onChangeMnemonic(true);
    this.mmc.onCreateMnemonic(true);
  }
}
