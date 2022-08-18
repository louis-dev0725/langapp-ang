import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Drill, WordInfo } from '@app/interfaces/common.interface';
import { CardsService } from '@app/training/cards/cards.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import editIcon from '@iconify/icons-mdi/edit';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';

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
  card: WordInfo;
  drills: Drill[];
  startTime = Date.now();
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  playAudio(source: string) {
    const audio = new Audio();
    audio.src = source;
    audio.load();
    audio.play();
  }

  goToKanjiInfo(route: string) {
    const [_, id] = route.split('_');
    this.router.navigate(['training', 'kanji-info', id]);
  }

  getTrainingDetails() {
    this.cardsService
      .getCurrentCard()
      .pipe(untilDestroyed(this))
      .subscribe((card) => {
        this.card = card;
        this.cd.markForCheck();
      });
    this.cardsService
      .getTrainingDrills()
      .pipe(untilDestroyed(this))
      .subscribe((drills) => {
        this.drills = drills;
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
