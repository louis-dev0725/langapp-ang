import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { SessionService } from '../services/session.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatDialog } from "@angular/material";
import { ConfirmDialogComponent, ConfirmDialogModel } from "@app/common/confirm-dialog/confirm-dialog.component";
import { TranslatingService } from "@app/services/translating.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public user;

  private langMap = {
    'ru': 'Русский',
    'en': 'English',
  };

  languages = ['Русский', 'English'];

  get currentLang(): string {
    return this.langMap[this.session.lang];
  }

  get isLoggedIn(): boolean {
    return this.session.isLoggedIn;
  }

  constructor(
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
