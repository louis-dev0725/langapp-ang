import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SrsService } from '@app/services/srs.service';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { TranslatingService } from '@app/services/translating.service';
import { Card, UserDictionary } from '@app/interfaces/common.interface';

import { ModalMnemonicComponent } from '@app/training/modal-mnemonic/modal-mnemonic.component';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-cards-word-kanji',
  templateUrl: './combo-study.component.html',
  styleUrls: ['./combo-study.component.scss']
})
export class ComboStudyComponent implements OnInit, OnDestroy {
  cardsArray: UserDictionary[] = null;
  cards: UserDictionary = null;
  loading = false;

  checkYourself = false;
  arrIndex = 0;
  endTraining = false;
  endTrainingText = null;
  user_id = 0;
  openModal = false;
  baseUrl: string;

  @ViewChild(ModalMnemonicComponent) mmc: ModalMnemonicComponent;

  constructor(private srsService: SrsService,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private session: SessionService,
    private translatingService: TranslatingService) {
    this.baseUrl = api.apiHost;
  }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.api.getComboStudy({}).pipe(untilDestroyed(this)).subscribe(res => {
      this.loading = false;
      this.cardsArray = res?.items ?? [];
      this.getOtherInfoElement(this.cardsArray); // TODO: change
    })
  }

  getOtherInfoElement(elements) {
    let words = null;
    let mnemonic = null;
    elements.forEach((element) => {
      if (element.type === 2) {
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
        this.snackBar.open(String(res.error), null, { duration: 3000 });
      }

      this.loading = false;
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

      if (element.type === 2) {
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
          console.log(element.words);
        }

        element.word_on = this.showReadings(element?.dictionaryWord?.data?.readings, 'on', '');
        element.word_kun = this.showReadings(element?.dictionaryWord?.data?.readings, 'kun', '');

        if (element?.dictionaryWord?.data?.meanings) {
          element.word_translate = element?.dictionaryWord?.data?.meanings.map(m => m.value).join(', ');
        }
      }
    });
    this.cards = elements[0];
  }

  showReadings(readings: { type: string, value: string }[], type: string, title: string) {
    let result = readings.filter(r => r.type == type).map(r => r.value).join(', ');
    if (result.length > 0) {
      result = title + result;
    }
    return result;
  }

  ngOnDestroy() { }

  checkButton(action: any) {
    if (action !== 'checkYourself') {
      this.loading = true;

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
          this.snackBar.open(this.translatingService.translates['confirm'].user_dictionary.saved, null, { duration: 3000 });
        } else {
          this.snackBar.open(String(res.error), null, { duration: 3000 });
        }

        this.loading = false;
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
