import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/common.interface';

@UntilDestroy()
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnChanges, OnDestroy {
  public messages = [];
  public user: User;

  constructor(private api: ApiService, private userService: UserService) {}

  ngOnInit() {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.messages = this.user && this.user['notifications'] ? this._mapMessages(this.user['notifications']) : [];
    });
  }

  ngOnDestroy() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user']['notifications']) {
      this.messages = this._mapMessages(changes['user']['notifications']);
    }
  }

  public onValueChange(msg) {
    const data = { id: msg.id, onClose: true };
    this.user['notifications'] = this.user['notifications'].filter((el) => el.id !== msg.id);
    this.userService.user$.next(this.user);
    this.api
      .onCloseNotify(data)
      .pipe(untilDestroyed(this))
      .subscribe(() => {});
  }

  private _mapMessages(msg) {
    return msg.map((el) => {
      return {
        ...el,
        data: [
          {
            severity: el.color,
            summary: el.title,
            detail: el.text,
          },
        ],
      };
    });
  }
}
