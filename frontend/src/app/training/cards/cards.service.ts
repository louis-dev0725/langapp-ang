import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Drill,
  KanjiCardInfo,
  TrainingCard,
  TrainingEndMessage,
  TrainingQuestionCard,
  WordInfo
} from '@app/interfaces/common.interface';
import {Router} from "@angular/router";
import {CardTypeRouteEnum} from "@app/training/enums/card-type-route.enum";

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  currentCardIndex = 0;
  cardTypeRouteEnum = CardTypeRouteEnum;

  private trainingCards$ = new BehaviorSubject<TrainingCard>(null);
  private currentWord$ = new BehaviorSubject<string>(null);
  private currentCard$ = new BehaviorSubject(null);
  private currentCardType$ = new BehaviorSubject<string>(null);
  private isAudioCard$ = new BehaviorSubject<boolean>(null);
  private trainingDrills$ = new BehaviorSubject<Drill[]>(null);
  private endingMessage$ = new BehaviorSubject<TrainingEndMessage>(null);

  constructor(
    private router: Router,
  ) { }

  navigateToNextCard() {
    if (this.currentCardIndex < this.trainingDrills$.value.length) {
      const drillCardType = this.trainingDrills$.value[this.currentCardIndex].card.split('_')[0];
      this.currentCardType$.next(this.trainingDrills$.value[this.currentCardIndex].card);
      let cardType: WordInfo | KanjiCardInfo | TrainingQuestionCard;
      for (const card of Object.values(this.trainingCards$.value)) {
        if (card.cardType === drillCardType) {
          cardType = card;
        }
      }
      if (cardType.cardType === 'wordInfo' || cardType.cardType === 'kanjiInfo') {
        this.router.navigate(['training', this.cardTypeRouteEnum[drillCardType], cardType.wordId]);
      } else {
        this.currentCard$.next(cardType);
        this.router.navigate(['training', this.cardTypeRouteEnum[drillCardType]]);
      }
    } else {
      this.router.navigate(['training/end-of-training']);
    }
  }

  setTrainingCards(cards: TrainingCard) {
    this.trainingCards$.next(cards);
  }

  setCurrentWord(word: string) {
    this.currentWord$.next(word);
  }

  setIsAudioCard(isAudio: boolean) {
    this.isAudioCard$.next(isAudio);
  }

  setCurrentCardType(cardType: string) {
    this.currentCardType$.next(cardType);
  }

  setCurrentCard(card: any) {
    this.currentCard$.next(card);
  }

  setTrainingDrills(drills: Drill[]) {
    this.trainingDrills$.next(drills);
  }

  setEndingMessage(message: TrainingEndMessage) {
    this.endingMessage$.next(message);
  }

  getTrainingCards(): Observable<TrainingCard> {
    return this.trainingCards$;
  }

  getCurrentWord(): Observable<string> {
    return this.currentWord$;
  }

  getIsAudioCard(): Observable<boolean> {
    return this.isAudioCard$;
  }

  getCurrentCard(): Observable<any> {
    return this.currentCard$;
  }

  getCurrentCardType(): Observable<string> {
    return this.currentCardType$;
  }

  getTrainingDrills(): Observable<Drill[]> {
    return this.trainingDrills$;
  }

  getTrainingDrillsValue(): Drill[] {
    return this.trainingDrills$.value;
  }

  getEndingMessage(): Observable<TrainingEndMessage> {
    return this.endingMessage$;
  }

  resetTraining() {
    this.setTrainingCards(null);
    this.setCurrentWord(null);
    this.setCurrentCardType(null);
    this.setIsAudioCard(null);
    this.setTrainingDrills(null);
    this.setEndingMessage(null);
  }
}
