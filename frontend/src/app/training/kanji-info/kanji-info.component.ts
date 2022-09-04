import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CardsService, CurrentCardState } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, KanjiInfoCard, KanjiInfo, TrainingKanjiReading } from '@app/interfaces/common.interface';
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
  card: KanjiInfoCard;
  state: CurrentCardState;
  TrainingKanjiReadingArray: TrainingKanjiReading[];

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
    this.cardsService.currentCardState$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.state = state;
      this.card = <KanjiInfoCard>state.card;
      this.cd.markForCheck();
    });
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
