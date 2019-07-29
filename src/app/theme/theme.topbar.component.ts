import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMainComponent } from './theme.main.component';
import { SessionService } from "@app/services/session.service";
import { ApiService } from "@app/services/api.service";
import { untilDestroyed } from "ngx-take-until-destroy";

@Component({
  selector: 'app-topbar',
  templateUrl: './theme.topbar.component.html'
})
export class ThemeTopbarComponent implements OnInit, OnDestroy {
  public user;

  get isLoggedIn(): boolean {
    return this.session.isLoggedIn;
  }

  get isOpenedAdmin(): boolean {
    return this.session.openedAdmin;
  }

  constructor(public app: ThemeMainComponent,
              public session: SessionService,
              public api: ApiService) {
  }

  ngOnInit() {
    this.user = this.session.user;
    this.session.changingUser.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {}

}
