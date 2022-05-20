import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { take} from "rxjs/operators";
import {CardTypeRouteEnum} from "@app/training/enums/card-type-route.enum";

@UntilDestroy()
@Component({
  selector: 'app-audio-word',
  templateUrl: './audio-word.component.html',
  styleUrls: ['./audio-word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'full-width',
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
    this.playAllAudios();
  }

  playAllAudios() {
    this.audioTimeout = setTimeout(() => {
      let counter = 0;
      const maxIndex = 'answers' in this.card.question ? this.card.question.answers.length - 1 : null;
      this.audioInterval = setInterval(() => {
        if (counter <= maxIndex && 'answers' in this.card.question) {
          this.playAudio(this.card.question.answers[counter].audioUrls[0], false);
          counter += 1;
        } else {
          clearTimeout(this.audioTimeout);
          clearInterval(this.audioInterval);
        }
      }, 2000);
    });
  }

  get isWideScreen() {
    return window.innerWidth > 768;
  }

  playAudio(source: string, clear: boolean) {
    if (clear) {
      clearTimeout(this.audioTimeout);
      clearInterval(this.audioInterval);
    }
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
        this.playAudio(this.card.audioUrls[0], true);
        this.updateDrills();
      }
    } else {
      this.continueTraining();
    }
  }

  forgotAnswer() {
    this.isAnswered = true;
    this.isAnsweredCorrectly = false;
    this.playAudio(this.card.audioUrls[0], true);
    this.updateDrills();
  }

  updateDrills() {
    this.drills[this.cardsService.currentCardIndex] = {
      ...this.drills[this.cardsService.currentCardIndex],
      answerDuration: Date.now() - this.startTime,
      isAnsweredCorrectly: !!this.isAnsweredCorrectly,
      isFinished: true,
    };
    this.cardsService.currentCardIndex += 1;
    this.cardsService.setTrainingDrills(this.drills);
    this.api
      .reportTrainingDrills({ drills: this.drills })
      .pipe(untilDestroyed(this))
      .subscribe((message) => {
        this.cardsService.setEndingMessage(message);
      });
  }

  continueTraining() {
    if (!this.isAnsweredCorrectly) {
      this.cardsService.currentCardIndex = this.drills.findIndex(drill => drill.card.split('_')[0] === 'wordInfo');
    }
    // this.cardsService.navigateToNextCard(this.card.infoCard.split('_')[1]);
    this.cardsService.navigateToNextCard();
  }

  goToInfoCard(route: string) {
    const [card, id] = route.split('_');
    this.router.navigate(['training', card === 'wordInfo' ? 'word-info' : 'kanji-info', id]);
  }

  disableQuestion() {
    this.api
      .saveTrainingHidings({
        cardToHide: this.currentCardType,
        mode: 'disableAudioQuestionsFor1Hour',
        drills: this.drills,
      })
      .pipe(
        take(1)
      )
      .subscribe((response) => {
        this.cardsService.setTrainingDrills(response.drills);
      });
  }

  getTrainingDetails() {
    this.cardsService.getCurrentCard()
      .pipe(untilDestroyed(this))
      .subscribe(card => {
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
