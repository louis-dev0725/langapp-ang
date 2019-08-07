import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() public user;
  public messages = [];

  constructor(private msgService: MessageService, private api: ApiService, private sessionService: SessionService) {}

  ngOnInit() {
    this.messages = this.user ? this._mapMessages(this.user['notifications']) : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user']['notifications']) {
      this.messages = this._mapMessages(changes['user']['notifications']);
    }
  }

  public onValueChange(msg) {
    const data = { id: msg.id, onClose: true };
    this.api.onCloseNotify(data).subscribe(() => {
      this.user = this.user.filter(el => el.id !== msg.id);
      this.sessionService.changingUser.emit(this.user);
    });
  }

  private _mapMessages(msg) {
    return msg.map(el => {
      return {
        ...el,
        data: [
          {
            severity: el.color,
            summary: el.title,
            detail: el.text
          }
        ]
      };
    });
  }
}
