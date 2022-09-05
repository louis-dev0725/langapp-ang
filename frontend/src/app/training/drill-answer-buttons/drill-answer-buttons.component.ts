import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TrainingQuestionCard } from '@app/interfaces/common.interface';
import { AudioService } from '@app/services/audio.service';
import { CardsService } from '../cards/cards.service';

@Component({
  selector: 'app-drill-answer-buttons',
  templateUrl: './drill-answer-buttons.component.html',
  styleUrls: ['./drill-answer-buttons.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillAnswerButtonsComponent implements OnInit {
  @Input() card: TrainingQuestionCard;

  _isAnswered: boolean;

  get isAnswered() {
    return this._isAnswered;
  }

  @Output()
  isAnsweredChange = new EventEmitter<boolean>();

  @Input() set isAnswered(newValue: boolean) {
    this._isAnswered = newValue;
    this.isAnsweredChange.emit(newValue);
  }

  _answeredIndex: number;

  get answeredIndex() {
    return this._answeredIndex;
  }

  @Output()
  answeredIndexChange = new EventEmitter<number>();

  @Input() set answeredIndex(newValue: number) {
    this._answeredIndex = newValue;
    this.answeredIndexChange.emit(newValue);
  }
  _isAnsweredCorrectly: boolean;

  get isAnsweredCorrectly() {
    return this._isAnsweredCorrectly;
  }

  @Output()
  isAnsweredCorrectlyChange = new EventEmitter<boolean>();

  @Input() set isAnsweredCorrectly(newValue: boolean) {
    this._isAnsweredCorrectly = newValue;
    this.isAnsweredCorrectlyChange.emit(newValue);
  }

  constructor(private cardsService: CardsService, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.code.startsWith('Digit') || event.code == 'Enter') {
      event.preventDefault();
      if (!this.isAnswered) {
        const digit = Number(event.code.charAt(event.code.length - 1));
        if (this.card?.question?.answers && digit <= this.card.question.answers.length) {
          this.checkAnswer(digit);
        } else {
          this.forgotAnswer();
        }
      } else {
        this.continueTraining();
      }
    }
  }

  ngOnInit(): void {
    this.playAllAudios();
  }

  playAllAudios() {
    for (let answer of this?.card?.question?.answers) {
      if (answer.numberAudioUrl) {
        this.audioService.play(answer.numberAudioUrl, false);
        this.audioService.play('short-pause', false);
      }
      if (answer.audioUrls?.[0]) {
        this.audioService.play(answer.audioUrls?.[0], false);
        this.audioService.play('short-pause', false);
      }
    }
  }

  checkAnswer(index: number) {
    if (!this.isAnswered) {
      if ('answers' in this.card?.question) {
        this.isAnswered = true;
        this.answeredIndex = index;
        this.isAnsweredCorrectly = this.card.question?.answers[index - 1].isCorrectAnswer;
        this.audioService.play(this.card?.audioUrls?.[0]);
        this.cardsService.answerCard(this.isAnsweredCorrectly);
      }
    } else {
      this.continueTraining();
    }
    this.cd.markForCheck();
  }

  forgotAnswer() {
    this.isAnswered = true;
    this.isAnsweredCorrectly = false;
    this.audioService.play(this.card?.audioUrls?.[0]);
    this.cardsService.answerCard(this.isAnsweredCorrectly);
    this.cd.markForCheck();
  }

  continueTraining() {
    this.cardsService.navigateToNextCard();
  }
}
