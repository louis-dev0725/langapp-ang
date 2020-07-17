import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-navigate-action-card',
  templateUrl: './navigate-action-card.component.html',
  styleUrls: ['./navigate-action-card.component.scss']
})
export class NavigateActionCardComponent {

  openCard = false;
  @Output() clickActionCardButton: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onCheckButton(res) {
    if (res === 'checkYourself') {
      this.openCard = true;
    }

    this.clickActionCardButton.emit(res);
  }

  @HostListener('window:keydown', ['$event']) spaceEvent(event: any) {
    if (!this.openCard && event.code === 'Space') {
      this.onCheckButton('checkYourself');
    }
  }
}
