import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import { CardsService, CurrentCardState } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-furigana-whole-word',
  templateUrl: './furigana-whole-word.component.html',
  styleUrls: ['./furigana-whole-word.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class FuriganaWholeWordComponent implements OnInit {
  card: TrainingQuestionCard;
  state: CurrentCardState;

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
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
        this.cardsService.answerCard(this.state.isAnsweredCorrectly);
      }
    } else {
      this.continueTraining();
    }
  }

  forgotAnswer() {
    this.state.isAnswered = true;
    this.state.isAnsweredCorrectly = false;
    this.cardsService.answerCard(this.state.isAnsweredCorrectly);
  }

  continueTraining() {
    this.cardsService.navigateToNextCard();
  }

  getTrainingDetails() {
    this.cardsService.currentCardState$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.state = state;
      this.card = <TrainingQuestionCard>state.card;
      this.cd.markForCheck();
    });
  }
}
