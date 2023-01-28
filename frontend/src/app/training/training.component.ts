import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill } from '@app/interfaces/common.interface';
import { finalize } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingComponent implements OnInit {
  currentCardType: string;
  drills: Drill[];
  isOpenSettingsModal = false;
  isOpenHidingModal = false;
  selectedCardTypes: string[] = ['selectFuriganaForOneKanji', 'selectFuriganaForWholeWord', 'typeFuriganaForWholeWord', 'selectTranslationForWord', 'selectWordForTranslation', 'selectWordForAudio', 'selectWordForSentence', 'selectAudioForWord'];
  selectedHidingReason: string;
  showBackButton = false;
  hidingReasons = [
    {
      text: 'Hide just this question',
      value: 'onlyCurrentQuestion',
      show: true,
    },
    {
      text: 'Hide all questions about ',
      value: 'allWithCurrentWord',
      show: true,
    },
    {
      text: 'Disable this type of question',
      value: 'disableCardType',
      show: true,
    },
    {
      text: 'Disable questions with audio for 1 hour',
      value: 'disableAudioQuestionsFor1Hour',
      show: false,
    },
  ];
  autoPlayAudio = true;
  isLoading = false;

  cardTypes = [
    {
      text: 'Select furigana for one kanji',
      value: 'selectFuriganaForOneKanji',
    },
    {
      text: 'Select furigana for whole word',
      value: 'selectFuriganaForWholeWord',
    },
    {
      text: 'Type furigana for whole word',
      value: 'typeFuriganaForWholeWord',
    },
    {
      text: 'Select translation for word',
      value: 'selectTranslationForWord',
    },
    {
      text: 'Select word for translation',
      value: 'selectWordForTranslation',
    },
    {
      text: 'Select word for audio',
      value: 'selectWordForAudio',
    },
    {
      text: 'Select word for sentence',
      value: 'selectWordForSentence',
    },
    {
      text: 'Select audio for word',
      value: 'selectAudioForWord',
    },
  ];

  @ViewChild('scrollTo') scrollToEl: ElementRef;

  constructor(private cardsService: CardsService, private cd: ChangeDetectorRef, private api: ApiService) {}

  ngOnInit() {
    this.getTrainingDrills();
  }

  goBack() {
    this.cardsService.navigateToNextCard();
  }

  getTrainingDrills() {
    this.cardsService.showBackButton$.pipe(untilDestroyed(this)).subscribe((showBackButton) => {
      this.showBackButton = showBackButton;
      this.cd.markForCheck();
    });
    this.cardsService.currentCardState$.pipe(untilDestroyed(this)).subscribe((state) => {
      // this.state = state;
      // this.card = <TrainingQuestionCard>state.card;
      if (state && state.card) {
        this.currentCardType = state.card.cardType;
        // @ts-ignore
        this.hidingReasons[3].show = state.card?.question?.isAudioQuestion === true;
      }
      this.cd.markForCheck();

      let scrollToEl = <HTMLDivElement>this.scrollToEl?.nativeElement;
      if (scrollToEl) {
        let rect = scrollToEl.getBoundingClientRect();
        let newY = rect.top + window.scrollY - 60;
        if (window.scrollY > newY) {
          window.scrollTo({ top: newY });
        }
      }
    });
    this.cardsService.drills$.pipe(untilDestroyed(this)).subscribe((drills) => {
      this.drills = drills;
      this.cd.markForCheck();
    });
  }

  openSettingsModal() {
    this.isOpenSettingsModal = true;
  }

  openHidingModal(isOpen: boolean) {
    this.isOpenHidingModal = isOpen;
  }

  saveSettings() {
    this.showLoading(true);
    this.api
      .saveTrainingSetting({
        settings: {
          disabledCardTypes: this.selectedCardTypes,
          autoPlayAudio: this.autoPlayAudio,
        },
        drills: this.drills?.length ? this.drills : [],
      })
      .pipe(
        finalize(() => {
          this.isOpenSettingsModal = false;
          this.showLoading(false);
        })
      )
      .subscribe((response) => {
        this.cardsService.drills$.next(response.drills);
      });
  }

  saveHidings() {
    if (!this.selectedHidingReason) {
      return;
    }
    this.showLoading(true);
    this.api
      .saveTrainingHidings({
        cardToHide: this.currentCardType,
        mode: this.selectedHidingReason,
        drills: this.drills,
      })
      .pipe(
        finalize(() => {
          this.isOpenHidingModal = false;
          this.selectedHidingReason = null;
          this.showLoading(false);
        })
      )
      .subscribe((response) => {
        this.cardsService.drills$.next(response.drills);
      });
  }

  private showLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.cd.markForCheck();
  }
}
