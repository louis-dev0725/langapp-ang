import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, KanjiCardInfo, TrainingKanjiReading } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-kanji-info',
  templateUrl: './kanji-info.component.html',
  styleUrls: ['./kanji-info.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class KanjiInfoComponent implements OnInit {
  card: KanjiCardInfo;
  TrainingKanjiReadingArray: TrainingKanjiReading[];
  startTime = Date.now();
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private router: Router, private api: ApiService, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.code.startsWith('Digit') || event.code == 'Enter') {
      event.preventDefault();
      this.goToNextCard();
    }
  }

  goToWordInfo(cardId: string) {
    this.cardsService.navigateToCardById(cardId);
  }

  getTrainingDetails() {
    this.cardsService
      .getCurrentCard()
      .pipe(untilDestroyed(this))
      .subscribe((card) => {
        this.setCard(card);
        this.cd.markForCheck();
      });
  }

  setCard(card: KanjiCardInfo) {
    this.card = card;
  }

  showMore(first: number, second: number, type: string, countToAdd: number) {
    this.card[type][first].exampleWords[second].countExampleSentencesToShow += countToAdd;
    this.cd.markForCheck();
  }

  showMoreWords(first: number, type: string, countToAdd: number) {
    this.card[type][first].countExampleWordsToShow += countToAdd;
    this.cd.markForCheck();
  }

  goToNextCard() {
    this.cardsService.answerCard(null);
    this.cardsService.navigateToNextCard();
  }
}
