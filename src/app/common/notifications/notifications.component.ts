import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnChanges {
  public messages = [];
  public user;
  public isLoggedIn$ = this.store.select(getAuthorizedIsLoggedIn);

  constructor(public sessionService: SessionService,
              private msgService: MessageService,
              private api: ApiService,
              private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.user = this.sessionService.user;
    this.messages = this.user && this.user['notifications'] ? this._mapMessages(this.user['notifications']) : [];

    this.sessionService.changingUser.subscribe(user => {
      this.user = user;
      this.messages = this.user && this.user['notifications'] ? this._mapMessages(this.user['notifications']) : [];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user']['notifications']) {
      this.messages = this._mapMessages(changes['user']['notifications']);
    }
  }

  public onValueChange(msg) {
    const data = { id: msg.id, onClose: true };
    this.api.onCloseNotify(data).subscribe(() => {
      this.user['notifications'] = this.user['notifications'].filter(el => el.id !== msg.id);
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
