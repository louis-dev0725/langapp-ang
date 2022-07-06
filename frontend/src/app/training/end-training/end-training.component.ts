import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '@app/training/cards/cards.service';
import { TrainingEndMessage } from '@app/interfaces/common.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-end-training',
  templateUrl: './end-training.component.html',
  styleUrls: ['./end-training.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'full-width',
  },
})
export class EndTrainingComponent implements OnInit {
  endMessage: TrainingEndMessage;

  constructor(private cardService: CardsService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getEndMessage();
  }

  goToTrainingStart() {
    this.cardService.resetTraining();
    this.cardService.loadCards();
  }

  getEndMessage() {
    this.cardService
      .getEndingMessage()
      .pipe(untilDestroyed(this))
      .subscribe((message) => {
        this.endMessage = message;
        this.cd.markForCheck();
      });
  }
}
