import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMainComponent } from './theme.main.component';
import { SessionService } from "@app/services/session.service";
import { ApiService } from "@app/services/api.service";
import { TranslatingService } from "@app/services/translating.service";
import { EventService } from "@app/event.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material";
import { untilDestroyed } from "ngx-take-until-destroy";
import { ConfirmDialogComponent, ConfirmDialogModel } from "@app/common/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-topbar',
  templateUrl: './theme.topbar.component.html'
})
export class ThemeTopbarComponent implements OnInit, OnDestroy {
  public user;

  private langMap = {
    'ru': 'Русский',
    'en': 'English',
  };

  public languages = ['Русский', 'English'];

  get currentLang(): string {
    return this.langMap[this.session.lang];
  }

  get isLoggedIn(): boolean {
    return this.session.isLoggedIn;
  }

  get isOpenedAdmin(): boolean {
    return this.session.openedAdmin;
  }

  constructor(public app: ThemeMainComponent,
              public session: SessionService,
              public api: ApiService,
              private translatingService: TranslatingService,
              private eventService: EventService,
              private router: Router,
              private ref: ChangeDetectorRef,
              private translate: TranslateService,
              private confirmDialog: MatDialog) {
  }

  ngOnInit() {
    this.user = this.session.user;
    this.session.changingUser.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {

  }

  setLanguage(lang: any) {
    const idx = this.languages.indexOf(lang);
    this.session.lang = (idx > 0) ? 'en' : 'ru';
    this.translate.use(this.session.lang);
    this.eventService.emitChangeEvent({type: 'language-change'});
  }

  logout() {
    const dialogModel = new ConfirmDialogModel(this.translatingService.translates['Logout confirm title'], this.translatingService.translates['Logout confirm msg']);

    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogModel
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api.logout();
      }
    })
    // this.router.navigateByUrl('/')
  }

}
