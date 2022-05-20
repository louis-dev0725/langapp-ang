import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
import editIcon from '@iconify/icons-mdi/edit';
import { CardsService } from '@app/training/cards/cards.service';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {CardTypeRouteEnum} from "@app/training/enums/card-type-route.enum";

@UntilDestroy()
@Component({
  selector: 'app-type-furigana-whole-word',
  templateUrl: './type-furigana-whole-word.component.html',
  styleUrls: ['./type-furigana-whole-word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'full-width',
  },
})
export class TypeFuriganaWholeWordComponent implements OnInit, AfterViewInit {
  card: TrainingQuestionCard;
  drills: Drill[];
  startTime = Date.now();
  enteredAnswer = [];
  isAnswered: boolean;
  isAnsweredCorrectly: boolean;
  cardTypeRouteEnum = CardTypeRouteEnum;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  ngAfterViewInit() {
    const rts = document.getElementsByTagName('rt');
    for (let i = 0; i < rts.length; i++) {
      rts[i].classList.add('rt-furigana-font-small');
    }
  }

  forgotAnswer() {
    this.isAnswered = true;
    this.isAnsweredCorrectly = false;
    this.updateDrills();
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

  playAudio(source: string) {
    const audio = new Audio();
    audio.src = source;
    audio.load();
    audio.play();
  }

  enterAnswer(value: string) {
    this.enteredAnswer.push(value);
    if ('buttons' in this.card.question) {
      if (this.enteredAnswer.join('').length === this.card.question.buttons.length) {
        this.isAnswered = true;
        this.isAnsweredCorrectly = this.enteredAnswer.join('') === this.card.question.correctAnswers[0];
        this.updateDrills();
      }
    }
  }

  inputAnswer(event: any, index: number) {
    this.enteredAnswer[index] = event.target.value;
    if ('buttons' in this.card.question) {
      if (this.enteredAnswer.join('').length === this.card.question.buttons.length) {
        this.isAnswered = true;
        this.isAnsweredCorrectly = this.enteredAnswer.join('') === this.card.question.correctAnswers[0];
        this.updateDrills();
      }
    }
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
    this.api.reportTrainingDrills({ drills: this.drills }).pipe(untilDestroyed(this)).subscribe();
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
      .getTrainingDrills()
      .pipe(untilDestroyed(this))
      .subscribe((drills) => {
        this.drills = drills;
        this.cd.markForCheck();
      });
  }
}
