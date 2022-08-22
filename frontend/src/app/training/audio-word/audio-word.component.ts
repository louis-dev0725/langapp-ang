import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';

@UntilDestroy()
@Component({
  selector: 'app-audio-word',
  templateUrl: './audio-word.component.html',
  styleUrls: ['./audio-word.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class AudioWordComponent implements OnInit {
  card: TrainingQuestionCard;
  currentCardType: string;
  drills: Drill[];
  startTime = Date.now();
  isAnswered = false;
  answeredIndex: number;
  isAnsweredCorrectly: boolean;
  cardTypeRouteEnum = CardTypeRouteEnum;
  audioTimeout: any;
  audioInterval: any;

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  get isWideScreen() {
    return window.innerWidth > 768;
  }

  disableQuestion() {
    this.api
      .saveTrainingHidings({
        cardToHide: this.currentCardType,
        mode: 'disableAudioQuestionsFor1Hour',
        drills: this.drills,
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.cardsService.setTrainingDrills(response.drills);
      });
  }

  getTrainingDetails() {
    this.cardsService
      .getCurrentCard()
      .pipe(untilDestroyed(this))
      .subscribe((card) => {
        this.card = card;
        this.cardsService.setIsAudioCard(card?.question?.isAudioQuestion);
        this.cd.markForCheck();
      });
    this.cardsService
      .getCurrentCardType()
      .pipe(untilDestroyed(this))
      .subscribe((cardType) => {
        this.currentCardType = cardType;
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
}
