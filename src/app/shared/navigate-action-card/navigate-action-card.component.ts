import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-navigate-action-card',
  templateUrl: './navigate-action-card.component.html',
  styleUrls: ['./navigate-action-card.component.scss']
})
export class NavigateActionCardComponent {

  openCard = false;
  @Output() clickActionCardButton: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  onCheckButton(res) {
    if (res === 'checkYourself') {
      this.openCard = true;
    } else {
      this.clickActionCardButton.emit(res);
    }
  }

  @HostListener('window:keydown', ['$event']) spaceEvent(event: any) {
    if (!this.openCard && event.code === 'Space') {
      this.onCheckButton('checkYourself');
    }
  }
}
