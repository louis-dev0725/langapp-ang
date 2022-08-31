import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Drill, TrainingQuestionCard } from '@app/interfaces/common.interface';
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
  card: TrainingQuestionCard;
  drills: Drill[];
  startTime = Date.now();
  isAnswered: boolean;
  isAnsweredCorrectly: boolean;
  cardTypeRouteEnum = CardTypeRouteEnum;
  enteredAnswer: string;

  icons = {
    editIcon,
  };

  constructor(private cardsService: CardsService, private api: ApiService, private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService) {}

  ngOnInit(): void {
    this.getTrainingDetails();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if ((event.code.startsWith('Digit') || event.code == 'Enter') && this.isAnswered) {
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
