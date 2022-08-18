import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, KanjiCardInfo, TrainingKanjiReading } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';

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
  meaning: string;
  startTime = Date.now();
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private router: Router, private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  playAudio(source: string) {
    const audio = new Audio();
    audio.src = source;
    audio.load();
    audio.play();
  }

  goToWordInfo(route: string) {
    const [_, id] = route.split('_');
    this.router.navigate(['training', 'word-info', id]);
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
    this.meaning = card.meanings.map((m) => m.value).join(', ');
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
