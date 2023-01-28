import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { CardsService, CurrentCardState } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-word-sentence-video',
  templateUrl: './word-sentence-video.component.html',
  styleUrls: ['./word-sentence-video.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class WordSentenceVideoComponent implements OnInit {
  card: TrainingQuestionCard;
  state: CurrentCardState;

  constructor(public cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  initCard() {
    this.audioService.play(this.card?.audioUrls?.[0]);
  }

  get isWideScreen() {
    return window.innerWidth > 768;
  }

  checkAnswer(index: number) {
    if (!this.state.isAnswered) {
      if ('answers' in this.card?.question) {
        this.state.isAnswered = true;
        this.state.answeredIndex = index;
        this.state.isAnsweredCorrectly = this.card.question?.answers[index - 1].isCorrectAnswer;
        this.audioService.play(this.card?.audioUrls?.[0]);
        this.cardsService.answerCard(this.state.isAnsweredCorrectly);
      }
    } else {
      this.continueTraining();
    }
  }

  forgotAnswer() {
    this.state.isAnswered = true;
    this.state.isAnsweredCorrectly = false;
    this.audioService.play(this.card?.audioUrls?.[0]);
    this.cardsService.answerCard(this.state.isAnsweredCorrectly);
  }

  continueTraining() {
    this.cardsService.navigateToNextCard();
  }

  goToInfoCard(route: string) {
    const [card, id] = route.split('_');
    this.router.navigate(['training', card === 'wordInfo' ? 'word-info' : 'kanji-info', id]);
  }

  getTrainingDetails() {
    this.cardsService.currentCardState$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.state = state;
      this.card = <TrainingQuestionCard>state.card;
      this.initCard();
      this.cd.markForCheck();
    });
  }
}
