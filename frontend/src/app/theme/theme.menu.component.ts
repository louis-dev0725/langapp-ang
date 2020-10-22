import { Component, Input, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from '@app/services/translating.service';
import { EventService } from '@app/event.service';
import { APP_NAME } from '@app/config/config';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { ApiService } from '@app/services/api.service';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  templateUrl: './theme.menu.component.html'
})
export class ThemeMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  public appName = APP_NAME;
  public user;
  public isLoggedIn: boolean;

  model = [];
  languages = ['Русский', 'English'];

  private isLoggedIn$: Observable<boolean> = this.store.select(getAuthorizedIsLoggedIn);

  @Input() reset: boolean;

  @ViewChild('scrollPanel', { static: true }) layoutMenuScrollerViewChild;

  constructor(public app: ThemeMainComponent, public api: ApiService, public session: SessionService,
              private cd: ChangeDetectorRef, private eventService: EventService, private translate: TranslateService,
              private confirmDialog: MatDialog, private translatingService: TranslatingService,
              private store: Store<fromStore.State>) {
    this.isLoggedIn$.pipe(untilDestroyed(this)).subscribe((authState: boolean) => this.isLoggedIn = authState);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
  }

  ngOnDestroy() {}

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
      this.api.updateUser({ id: user.id, language: user.language }).pipe(untilDestroyed(this)).subscribe(() => {});
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

  ngOnInit() {
    this.model = this.getModel();
    this.user = this.session.user;

    this.session.changingUser.pipe(untilDestroyed(this)).subscribe(user => {
      this.model = [...this.getModel()];
      this.user = user;
      this.cd.detectChanges();
    });
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
          }
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
        label: 'Partnership',
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
        label: 'Payment',
        name: 'payment',
        routerLink: ['/payment'],
        hide: !this.isLoggedIn
      },
      {
        label: 'Materials',
        routerLink: ['/content'],
        hide: !this.isLoggedIn,
        items: [
          {
            label: 'Create material',
            routerLink: ['/content/create']
          },
          {
            label: 'Catalog materials',
            routerLink: ['/content/materials']
          }
        ]
      },
      {
        label: 'Category materials',
        routerLink: ['/category'],
        hide: !this.isAdmin || (this.isAdmin && this.isOpenedAdmin)
      },
      {
        label: 'Dictionary',
        routerLink: ['/dictionary'],
        hide: !this.isLoggedIn,
      },
      {
        label: 'Training',
        routerLink: ['/training'],
        hide: !this.isLoggedIn,
      },
      {
        label: 'Contacts',
        routerLink: ['/contacts']
      },
      {
        label: 'Settings',
        routerLink: ['/settings/profile']
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

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-theme-submenu]',
  /* tslint:enable:component-selector */
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="root ? item : item.items">
      <li [ngClass]="{ 'active-menuitem': isActive(i) }" [class]="child?.badgeStyleClass" *ngIf="!child?.hide">
        <a [href]="child.url || '#'" (click)="itemClick($event, child, i)" *ngIf="!child.routerLink && !child?.hide"
          [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target" (mouseenter)="onMouseEnter(i)" class="ripplelink">
          <span class="menuitem-text">{{ child.label | translate }}</span>
          <i class="material-icons layout-submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
          <span class="menuitem-badge" *ngIf="child.badge">{{ child.badge }}</span>
        </a>

        <a (click)="itemClick($event, child, i)" *ngIf="child.routerLink" [routerLink]="child.routerLink"
           routerLinkActive="active-menuitem-routerlink" [routerLinkActiveOptions]="{ exact: true }"
           [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target" (mouseenter)="onMouseEnter(i)" class="ripplelink">
          <span class="menuitem-text">
            {{ child.label | translate }}
            <ng-container [ngSwitch]="child.name">
              <span class="menuitem-text-additional" *ngSwitchCase="'payment'">
                <span>({{ 'balance' | translate }}: {{ user?.balance | formatCurrency: session.lang }})</span>
              </span>
            </ng-container>
          </span>
          <i class="material-icons layout-submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
          <span class="menuitem-badge" *ngIf="child.badge">{{ child.badge }}</span>
        </a>

        <ul app-theme-submenu [item]="child" *ngIf="child.items && isActive(i)" [visible]="isActive(i)" [reset]="reset"
            [parentActive]="isActive(i)" [@children]="app.isHorizontal() && root ? (isActive(i) ? 'visible' : 'hidden')
             : (isActive(i) ? 'visibleAnimated' : 'hiddenAnimated')">
        </ul>
      </li>
    </ng-template>`,
  animations: [
    trigger('children', [
      state('void', style({height: '0'})),
      state('hiddenAnimated', style({height: '0'})),
      state('visibleAnimated', style({height: '*'})),
      state('visible', style({height: '*'})),
      state('hidden', style({height: '0'})),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
   ]
})

export class ThemeSubMenuComponent {
  @Input() user;

  private langMap = {
    ru: 'Русский',
    en: 'English'
  };

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  constructor(
    public app: ThemeMainComponent,
    public router: Router,
    public location: Location,
    public appMenu: ThemeMenuComponent,
    public session: SessionService
  ) {}


  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
      event.preventDefault();
    }

    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    if (item.routerLink || item.items || item.command || item.url) {
      this.activeIndex = (this.activeIndex as number) === index ? -1 : index;
    }

    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.appMenu.layoutMenuScrollerViewChild.moveBar();
      }, 450);

      event.preventDefault();
    }

    if (!item.items) {
      if (this.app.isMobile()) {
        this.app.sidebarActive = false;
        this.app.mobileMenuActive = false;
      }

      this.app.resetMenu = this.app.isHorizontal();

      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && this.app.isHorizontal() && !this.app.isMobile() && !this.app.isTablet()) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isOverlay())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }
}