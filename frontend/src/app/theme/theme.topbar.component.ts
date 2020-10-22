import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-topbar',
  templateUrl: './theme.topbar.component.html'
})
export class ThemeTopbarComponent implements OnInit, OnDestroy {
  public user;
  public isLoggedIn$: Observable<boolean> = this.store.select(getAuthorizedIsLoggedIn);

  get isOpenedAdmin(): boolean {
    return this.session.openedAdmin;
  }

  constructor(public app: ThemeMainComponent,
              public session: SessionService,
              public api: ApiService,
              private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.user = this.session.user;
    this.session.changingUser.pipe(untilDestroyed(this)).subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {}
}