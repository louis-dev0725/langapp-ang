import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '@app/services/api.service';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store';
import * as fromAccount from '@app/store/actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() public user;
  public messages = [];

  constructor(private msgService: MessageService, private api: ApiService, private _store: Store<fromStore.State>) {}

  ngOnInit() {
    this.messages = this.user ? this._mapMessages(this.user['notifications']) : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']['notifications']) {
      this.messages = this._mapMessages(changes['user']);
    }
  }

  public onValueChange(msg) {
    this._store.dispatch(new fromAccount.UpdateAccount());
    const data = { id: msg.id, onClose: true };
    this.api.onCloseNotify(data).subscribe(
      () => {
        this.user = this.user.filter(el => el.id !== msg.id);
        this._store.dispatch(new fromAccount.UpdateAccountSuccess(this.user));
      },
      err => {
        this._store.dispatch(new fromAccount.UpdateAccountFail(err));
      }
    );
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
