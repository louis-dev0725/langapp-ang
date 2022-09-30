import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingQuestionCard } from '@app/interfaces/common.interface';
import { AudioService } from '@app/services/audio.service';
import editIcon from '@iconify/icons-mdi/edit';
import { CardsService } from '../cards/cards.service';

@Component({
  selector: 'app-drill-word',
  templateUrl: './drill-word.component.html',
  styleUrls: ['./drill-word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillWordComponent implements OnInit {
  @Input() card: TrainingQuestionCard;
  @Input() isAnswered: boolean = false;
  @Input() centerOnDesktop: boolean = true;
  @Input() useHide: boolean = false;

  icons = {
    editIcon,
  };

  constructor(private router: Router, private cd: ChangeDetectorRef, public audioService: AudioService, private cardsService: CardsService) {}

  ngOnInit(): void {}

  goToInfoCard(cardId: string) {
    this.cardsService.navigateToCardById(cardId);
  }
}
