import { Component, Input, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from '@app/services/translating.service';
import { EventService } from '@app/event.service';
import { APP_NAME } from '@app/config/config';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { ApiService } from '@app/services/api.service';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppComponent } from '@app/app.component';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './theme.menu.component.html'
})
export class ThemeMenuComponent implements OnInit {

  model: any[];

  public appName = APP_NAME;
  public user;
  public isLoggedIn: boolean;

  languages = ['Русский', 'English'];

  private isLoggedIn$: Observable<boolean> = this.store.select(getAuthorizedIsLoggedIn);

  constructor(public app: AppComponent, public appTheme: ThemeMainComponent, public api: ApiService, public session: SessionService,
    private cd: ChangeDetectorRef, private eventService: EventService, private translate: TranslateService,
    private confirmDialog: MatDialog, private translatingService: TranslatingService,
    private store: Store<fromStore.State>) {
    this.isLoggedIn$.pipe(untilDestroyed(this)).subscribe((authState: boolean) => this.isLoggedIn = authState);
  }

  ngOnInit() {
    this.model = this.getModel();
    this.user = this.session.user;

    this.session.changingUser.pipe(untilDestroyed(this)).subscribe(user => {
      this.model = [...this.getModel()];
      this.user = user;
      this.cd.detectChanges();
    });
  }

  get isOpenedAdmin(): boolean {
    return this.session.openedAdmin;
  }

  get isAdmin(): boolean {
    return this.session.isAdmin;
  }

  setLanguage(lang: any) {
    let language: string;
    if (lang === 'Русский') {
      language = 'ru';
    } else {
      language = 'en';
    }
    localStorage.setItem('lang', language);
    this.translate.use(language);
    this.eventService.emitChangeEvent({ type: 'language-change' });
    if (this.session.user !== null) {
      this.session.changeUserLanguage(language);
      const user = this.session.user;
      this.api.updateUser({ id: user.id, language: user.language }).pipe(untilDestroyed(this)).subscribe(() => { });
    }
  }

  public updateItems(el) {
    el['hide'] = !this.isLoggedIn;
    el['admin'] = this.session.isAdmin;
    if (el['items']) {
      el.items = el.items.map(res => {
        return this.updateItems(res);
      });
    }
    return el;
  }

  public getModel() {
    return [
      {
        label: 'Admin',
        hide: !this.isAdmin || (this.isAdmin && this.isOpenedAdmin),
        items: [
          {
            label: 'Clients',
            routerLink: ['/admin/users']
          },
          {
            label: 'Transactions',
            routerLink: ['/admin/transactions']
          },
          {
            label: 'Content categories',
            routerLink: ['/category']
          },
        ]
      },
      {
        label: 'Language',
        items: [
          {
            label: 'Русский',
            command: event => {
              this.setLanguage('Русский');
            }
          },
          {
            label: 'English',
            command: event => {
              this.setLanguage('English');
            }
          }
        ]
      },
      {
        label: 'Learning',
        hide: !this.isLoggedIn,
        items: [
          {
            label: 'Study new words',
            routerLink: ['/training'],
            hide: !this.isLoggedIn,
          },
          {
            label: 'Explore content',
            routerLink: ['/content/materials']
          },
          /*{
            label: 'Create material',
            routerLink: ['/content/create']
          },*/
          {
            label: 'My word list',
            routerLink: ['/dictionary'],
            hide: !this.isLoggedIn,
          },
        ]
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Payment',
            name: 'payment',
            routerLink: ['/payment'],
            hide: !this.isLoggedIn
          },
          {
            label: 'Settings',
            routerLink: ['/settings/profile']
          },
          {
            label: 'Affiliate program',
            hide: !this.isLoggedIn,
            items: [
              {
                label: 'About',
                routerLink: ['/partners/about']
              },
              {
                label: 'Clients',
                routerLink: ['/partners/clients']
              },
              {
                label: 'Transactions',
                routerLink: ['/partners/transactions']
              }
            ]
          },
          {
            label: 'Sign up',
            routerLink: ['/auth/signup'],
            hide: this.isLoggedIn
          },
          {
            label: 'Sign in',
            routerLink: ['/auth/signin'],
            hide: this.isLoggedIn
          },
          {
            label: 'Logout',
            hide: !this.isLoggedIn,
            command: event => {
              this.logout();
            }
          }
        ],
      },
      {
        label: 'Contacts',
        items: [
          {
            label: 'Contacts',
            routerLink: ['/contacts']
          },
        ],
      },
    ];
  }

  logout() {
    if (!this.isOpenedAdmin) {
      const dialogModel = new ConfirmDialogModel(
        this.translatingService.translates['Logout confirm title'],
        this.translatingService.translates['Logout confirm msg']
      );

      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: dialogModel
      });

      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          this.api.logout();
        }
      });
    } else {
      this.api.logout();
    }

    window.postMessage({ type: 'Logout', text: 'Logout' }, '*');
  }
}