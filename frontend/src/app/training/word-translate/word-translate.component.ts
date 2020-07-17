import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-translate',
  templateUrl: './word-translate.component.html',
  styleUrls: ['./word-translate.component.scss']
})
export class WordTranslateComponent implements OnInit {

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

}
