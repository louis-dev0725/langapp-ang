import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-word-kanji',
  templateUrl: './cards-word-kanji.component.html',
  styleUrls: ['./cards-word-kanji.component.scss']
})
export class CardsWordKanjiComponent implements OnInit {

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor() { }

  ngOnInit() {
    this._isLoaded = true;
  }

  checkButton(action: string) {
    console.log(action);
  }
}
