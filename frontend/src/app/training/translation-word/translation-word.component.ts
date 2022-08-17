import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { CardTypeRouteEnum } from '@app/training/enums/card-type-route.enum';

@UntilDestroy()
@Component({
  selector: 'app-translation-word',
  templateUrl: './translation-word.component.html',
  styleUrls: ['./translation-word.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class TranslationWordComponent implements OnInit {
  card: TrainingQuestionCard;
  drills: Drill[];
  startTime = Date.now();
  isAnswered = false;
  answeredIndex: number;
  isAnsweredCorrectly: boolean;
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  @HostListener('document:keydown', ['$event'])
  handleAnswer(event: KeyboardEvent) {
    if (event.code.startsWith('Digit')) {
      event.preventDefault();
      if (!this.isAnswered) {
        const digit = Number(event.code.charAt(event.code.length - 1));
        if ('answers' in this.card?.question && digit <= this.card.question.answers.length) {
          this.checkAnswer(digit);
        }
      } else {
        this.continueTraining();
      }
    }
  }

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  get isWideScreen() {
    return window.innerWidth > 768;
  }

  playAudio(source: string) {
    const audio = new Audio();
    audio.src = source;
    audio.load();
    audio.play();
  }

  checkAnswer(index: number) {
    if (!this.isAnswered) {
      if ('answers' in this.card?.question) {
        this.isAnswered = true;
        this.answeredIndex = index;
        this.isAnsweredCorrectly = this.card.question?.answers[index - 1].isCorrectAnswer;
        this.cardsService.answerCard(this.isAnsweredCorrectly);
      }
    } else {
      this.continueTraining();
    }
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
