import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, KanjiCardInfo } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { Router } from '@angular/router';
import {CardTypeRouteEnum} from "@app/training/enums/card-type-route.enum";

@UntilDestroy()
@Component({
  selector: 'app-kanji-info',
  templateUrl: './kanji-info.component.html',
  styleUrls: ['./kanji-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'full-width',
  },
})
export class KanjiInfoComponent implements OnInit {
  card: KanjiCardInfo;
  drills: Drill[];
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
    this.cardsService.currentCardIndex = this.cardsService.getTrainingDrillsValue().findIndex(card => card.card.split('_')[0] === 'kanjiInfo');
    this.cardsService.getCurrentCard()
      .pipe(untilDestroyed(this))
      .subscribe(card => {
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

  showMore(first: number, second: number, type: string, count: number) {
    this.card[type][first].exampleWords[second].countExampleSentencesToShow = count;
    this.cd.markForCheck();
  }

  goToNextCard() {
    this.drills[this.cardsService.currentCardIndex] = {
      ...this.drills[this.cardsService.currentCardIndex],
      answerDuration: Date.now() - this.startTime,
      isAnsweredCorrectly: true,
      isFinished: true,
    };
    this.cardsService.currentCardIndex += 1;
    this.cardsService.setTrainingDrills(this.drills);
    this.api.reportTrainingDrills({ drills: this.drills }).pipe(untilDestroyed(this)).subscribe();
    this.cardsService.navigateToNextCard();
  }
}
