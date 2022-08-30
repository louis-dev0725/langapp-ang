import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardsService } from '@app/training/cards/cards.service';
import { Router } from '@angular/router';
import { AudioService } from '@app/services/audio.service';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss', '../drills-common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class IndexComponent {
  constructor(private apiService: ApiService, private cardsService: CardsService, private router: Router, private audioService: AudioService) {}

  startStudy() {
    this.audioService.prepareFromUserGesture();
    this.cardsService.loadCards();
  }
}
