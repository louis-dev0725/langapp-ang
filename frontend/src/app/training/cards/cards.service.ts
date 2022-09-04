import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drill, KanjiInfoCard, TrainingCards, TrainingEndMessage, TrainingQuestionCard, WordInfoCard } from '@app/interfaces/common.interface';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export class CurrentCardState {
  startTime = Date.now();
  isAnswered = false;
  answeredIndex: number;
  isAnsweredCorrectly: boolean;
  enteredAnswer?: string = '';

  constructor(public card: WordInfoCard | KanjiInfoCard | TrainingQuestionCard) {}
}

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class CardsService {
  currentDrillIndex = 0;
  cardTypeRouteEnum = CardTypeRouteEnum;

  public cards$ = new BehaviorSubject<TrainingCards>(null);
  // public currentWord$ = new BehaviorSubject<string>(null);
  // public currentCard$ = new BehaviorSubject<WordInfo | KanjiCardInfo | TrainingQuestionCard>(null);
  public currentCardState$ = new BehaviorSubject<CurrentCardState>(null);
  // public currentCardType$ = new BehaviorSubject<string>(null);
  // public isAudioCard$ = new BehaviorSubject<boolean>(null);
  public showBackButton$ = new BehaviorSubject<boolean>(false);
  public drills$ = new BehaviorSubject<Drill[]>(null);
  public endingMessage$ = new BehaviorSubject<TrainingEndMessage>(null);

  constructor(private router: Router, private api: ApiService) {}

  loadCards() {
    this.api
      .getTrainingCards()
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.cards$.next(response.cards);
        this.drills$.next(response.drills);
        this.navigateToNextCard();
      });
  }

  navigateToNextCard() {
    this.currentDrillIndex = this.drills$.value.findIndex((d) => !d.isFinished);
    if (this.currentDrillIndex != -1) {
      const currentDrill = this.drills$.value[this.currentDrillIndex];
      currentDrill.answerStartTime = Math.floor(Date.now());
      const currentCard = this.cards$.value[currentDrill.card];
      this.currentCardState$.next(new CurrentCardState(currentCard));
      this.showBackButton$.next(false);

      if (currentCard.cardType === 'wordInfo' || currentCard.cardType === 'kanjiInfo') {
        this.router.navigate(['training', this.cardTypeRouteEnum[currentCard.cardType], currentCard.wordId]);
      } else {
        this.router.navigate(['training', this.cardTypeRouteEnum[currentCard.cardType]]);
      }
    } else {
      console.log('end of training');
      this.router.navigate(['training/end-of-training']);
    }
  }

  navigateToCardById(cardId: string) {
    let currentCard = this.cards$.value[cardId];
    const [type, id] = cardId.split('_');
    if (!currentCard) {
      // Will be loaded from API if not exists
      // @ts-ignore
      currentCard = { cardType: type, cardId, wordId: Number(id) };
    }
    this.currentCardState$.next(new CurrentCardState(currentCard));
    this.currentDrillIndex = -1;
    this.showBackButton$.next(true);

    if (currentCard.cardType === 'wordInfo' || currentCard.cardType === 'kanjiInfo') {
      this.router.navigate(['training', this.cardTypeRouteEnum[currentCard.cardType], currentCard.wordId]);
    } else {
      this.router.navigate(['training', this.cardTypeRouteEnum[currentCard.cardType]]);
    }
  }

  disableAudioQuestionsFor1Hour() {
    this.api
      .saveTrainingHidings({
        cardToHide: this.currentCardState$.value.card.cardType,
        mode: 'disableAudioQuestionsFor1Hour',
        drills: this.drills$.value,
      })
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.drills$.next(response.drills);
      });
  }

  answerCard(isAnsweredCorrectly: boolean) {
    if (this.currentDrillIndex == -1) {
      return;
    }

    let drills = [...this.drills$.value];
    drills[this.currentDrillIndex] = {
      ...drills[this.currentDrillIndex],
      answerEndTime: Math.floor(Date.now() / 1000),
      isAnsweredCorrectly: isAnsweredCorrectly,
      isFinished: true,
    };
    this.drills$.next(drills);

    this.api
      .reportTrainingDrills({ drills: drills })
      .pipe(untilDestroyed(this))
      .subscribe((message) => {
        this.endingMessage$.next(message);
      });
  }

  resetTraining() {
    this.currentCardState$.next(null);
    this.drills$.next(null);
    this.endingMessage$.next(null);
  }
}
