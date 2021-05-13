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

  model: MenuItem[];

  public appName = APP_NAME;
  public user;
  public isLoggedIn: boolean;

  private isLoggedIn$: Observable<boolean> = this.store.select(getAuthorizedIsLoggedIn);

  constructor(public app: AppComponent,
    public appTheme: ThemeMainComponent,
    public api: ApiService,
    public session: SessionService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private store: Store<fromStore.State>) {
    this.isLoggedIn$.pipe(untilDestroyed(this)).subscribe((authState: boolean) => this.isLoggedIn = authState);
  }

  ngOnInit() {
    this.model = this.getModel();
    this.user = this.session.user;

    this.session.user$.pipe(untilDestroyed(this)).subscribe(user => {
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

  trackByIdentify(index: number, item: any) {
    return item.id ?? item.label;
  }

  public getModel() : MenuItem[] {
    return [
      {
        label: 'Admin',
        visible: this.isAdmin && !this.isOpenedAdmin,
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
        label: 'Learning',
        visible: this.isLoggedIn,
        items: [
          {
            label: 'Study new words',
            routerLink: ['/training'],
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
          },
        ]
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Settings',
            routerLink: ['/settings/profile'],
            visible: this.isLoggedIn,
          },
          /*{
            label: 'Affiliate program',
            visible: this.isLoggedIn,
            routerLink: ['/partners'],
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
          },*/
          {
            label: 'Sign up',
            routerLink: ['/auth/signup'],
            visible: !this.isLoggedIn
          },
          {
            label: 'Sign in',
            routerLink: ['/auth/signin'],
            visible: !this.isLoggedIn
          },
          /*{
            label: 'Logout',
            visible: this.isLoggedIn,
            command: event => {
              this.appTheme.logout();
            }
          }*/
          {
            label: 'Support',
            routerLink: ['/contacts']
          },
        ],
      }
    ];
  }
}