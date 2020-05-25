import { Component, Input, OnInit } from '@angular/core';

import { SrsService } from '@app/services/srs.service';
import { Card } from '@app/interfaces/common.interface';

@Component({
  selector: 'app-cards-kanji',
  templateUrl: './cards-kanji.component.html',
  styleUrls: ['./cards-kanji.component.scss']
})
export class CardsKanjiComponent implements OnInit {

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor(private srsService: SrsService) { }

  ngOnInit() {
    this._isLoaded = true;
  }

  checkButton(action: number) {
    console.log(action);

    const card: Card = {
      consecutiveCorrectAnswers: 0,
      due: undefined,
      easeFactor: 0,
      interval: 0,
      reviews: [],
      status: 0
    };

    let res = this.srsService.processAnswer(card, action);
    console.log(res);
  }
}
