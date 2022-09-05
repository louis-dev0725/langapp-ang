import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Drill, WordInfoCard } from '@app/interfaces/common.interface';
import { CardsService, CurrentCardState } from '@app/training/cards/cards.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import editIcon from '@iconify/icons-mdi/edit';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-word-info',
  templateUrl: './word-info.component.html',
  styleUrls: ['./word-info.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class WordInfoComponent implements OnInit {
  card: WordInfoCard;
  state: CurrentCardState;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  initCard() {
    this.audioService.play(this.card?.audioUrls?.[0]);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.code.startsWith('Digit') || event.code == 'Enter') {
      event.preventDefault();
      this.goToNextCard();
    }
  }

  goToKanjiInfo(cardId: string) {
    this.cardsService.navigateToCardById(cardId);
  }

  getTrainingDetails() {
    this.cardsService.currentCardState$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.state = state;
      this.card = <WordInfoCard>state.card;
      this.initCard();
      this.cd.markForCheck();
    });
  }

  showMoreExampleSentences(meaningI: number, countToAdd: number) {
    this.card.meanings[meaningI].countExampleSentencesToShow += countToAdd;
    this.cd.markForCheck();
  }

  showMoreMeanings(countToAdd: number) {
    this.card.countMeaningsToShow += countToAdd;
    this.cd.markForCheck();
  }

  goToNextCard() {
    this.cardsService.answerCard(null);
    this.cardsService.navigateToNextCard();
  }
}
