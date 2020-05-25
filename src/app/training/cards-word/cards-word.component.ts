import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-word',
  templateUrl: './cards-word.component.html',
  styleUrls: ['./cards-word.component.scss']
})
export class CardsWordComponent implements OnInit {

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
