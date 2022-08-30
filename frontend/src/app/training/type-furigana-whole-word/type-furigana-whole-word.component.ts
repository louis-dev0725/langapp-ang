import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Drill, TrainingButtonQuestionCard, TrainingQuestionCard } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-type-furigana-whole-word',
  templateUrl: './type-furigana-whole-word.component.html',
  styleUrls: ['./type-furigana-whole-word.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class TypeFuriganaWholeWordComponent implements OnInit {
  card: TrainingButtonQuestionCard;
  drills: Drill[];
  startTime = Date.now();
  enteredAnswer = [];
  isAnswered: boolean;
  isAnsweredCorrectly: boolean;
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  forgotAnswer() {
    this.isAnswered = true;
    this.isAnsweredCorrectly = false;
    this.cardsService.answerCard(this.isAnsweredCorrectly);
  }

  continueTraining() {
    this.cardsService.navigateToNextCard();
  }

  goToInfoCard(route: string) {
    const [card, id] = route.split('_');
    this.router.navigate(['training', card === 'wordInfo' ? 'word-info' : 'kanji-info', id]);
  }

  enterAnswer(value: string) {
    this.enteredAnswer.push(value);
    if ('buttons' in this.card.question) {
      if (this.enteredAnswer.join('').length === this.card.question.buttons.length) {
        this.isAnswered = true;
        this.isAnsweredCorrectly = this.enteredAnswer.join('') === this.card.question.correctAnswers[0];
        this.cardsService.answerCard(this.isAnsweredCorrectly);
      }
    }
  }

  inputAnswer(event: any, index: number) {
    this.enteredAnswer[index] = event.target.value;
    if ('buttons' in this.card.question) {
      if (this.enteredAnswer.join('').length === this.card.question.buttons.length) {
        this.isAnswered = true;
        this.isAnsweredCorrectly = this.enteredAnswer.join('') === this.card.question.correctAnswers[0];
        this.cardsService.answerCard(this.isAnsweredCorrectly);
      }
    }
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
      .getTrainingDrills()
      .pipe(untilDestroyed(this))
      .subscribe((drills) => {
        this.drills = drills;
        this.cd.markForCheck();
      });
  }
}
