import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardsService } from '@app/training/cards/cards.service';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class IndexComponent {
  constructor(private apiService: ApiService, private cardsService: CardsService, private router: Router) {}

  getTrainingCards() {
    this.cardsService.loadCards();
  }
}
