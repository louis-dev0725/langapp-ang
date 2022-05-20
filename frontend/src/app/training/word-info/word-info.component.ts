import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Drill, WordInfo} from '@app/interfaces/common.interface';
import {CardsService} from '@app/training/cards/cards.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import editIcon from '@iconify/icons-mdi/edit';
import {ApiService} from '@app/services/api.service';
import {Router} from '@angular/router';
import {CardTypeRouteEnum} from "@app/training/enums/card-type-route.enum";

@UntilDestroy()
@Component({
  selector: 'app-word-info',
  templateUrl: './word-info.component.html',
  styleUrls: ['./word-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'full-width',
  },
})
export class WordInfoComponent implements OnInit, AfterViewInit {
  card: WordInfo;
  drills: Drill[];
  startTime = Date.now();
  isFullExampleList = false;
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
    this.isFullExampleList = !(this.card?.exampleSentences?.length > this.card?.countExampleSentencesToShow);
  }

  ngAfterViewInit() {
    const rt = document.getElementById('main-furigana');
    for (let i = 0; i < rt?.children[0]?.children?.length; i++) {
      if (rt?.children[0]?.children[i]?.nodeName === 'RT') {
        rt?.children[0]?.children[i]?.classList.add('rt-furigana-font');
      }
    }
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
    this.cardsService.currentCardIndex = this.cardsService.getTrainingDrillsValue().findIndex(card => card.card.split('_')[0] === 'wordInfo');
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