import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Renderer,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem, ScrollPanel } from 'primeng/primeng';
import { ThemeMainComponent } from './theme.main.component';
import { SessionService } from "@app/services/session.service";
import { TranslatingService } from "@app/services/translating.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { TranslateService } from "@ngx-translate/core";
import { EventService } from "@app/event.service";

@Component({
  selector: 'app-menu',
  templateUrl: './theme.menu.component.html'
})

export class ThemeMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  model = [];
  languages = ['Русский', 'English'];
  @Input() reset: boolean;

  @ViewChild('scrollPanel', {static: true}) layoutMenuScrollerViewChild: ScrollPanel;

  constructor(public app: ThemeMainComponent,
              public session: SessionService,
              public translatingService: TranslatingService,
              private eventService: EventService,
              private translate: TranslateService) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.layoutMenuScrollerViewChild.moveBar();
    }, 100);
  }

  get isLoggedIn(): boolean {
    return this.session.isLoggedIn;
  }


  setLanguage(lang: any) {
    const idx = this.languages.indexOf(lang);
    this.session.lang = (idx > 0) ? 'en' : 'ru';
    this.translate.use(this.session.lang);
    this.eventService.emitChangeEvent({type: 'language-change'});
  }

  public updateItems(el) {
    el['hide'] = !this.isLoggedIn;
    if (el['items']) {
      el.items = el.items.map((res) => {
        return this.updateItems(res);
      })
    }
    return el;
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.model = [
      {
        label: 'Sign up',
        routerLink: ['signup'],
      },
      {
        label: 'Language',
        items: [
          {
            label: 'Русский',
            command: (event) => {
              this.setLanguage('Русский');
            }
          },
          {
            label: 'English',
            command: (event) => {
              this.setLanguage('English');
            }
          }
        ]
      },
      {
        label: 'Partnership',
        routerLink: ['partners'],
        hide: !this.isLoggedIn,
        items: [
          {
            label: 'About',
            routerLink: ['partners/about']
          },
          {
            label: 'Clients',
            routerLink: ['/partners/clients']
          },
          {
            label: 'Transactions',
            routerLink: ['/partners/transactions']
          },
        ]
      }
    ];
    this.session.changingUser.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.model.map((el) => {
        return this.updateItems(el);
      });
      console.log({...this.model});
    });
  }


  changeTheme(theme) {
    const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
    themeLink.href = 'assets/theme/theme-' + theme + '.css';
  }

  changeLayout(theme) {
    const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
    layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-theme-submenu]',
  /* tslint:enable:component-selector */
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
      <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child?.badgeStyleClass">
        <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink && !child?.hide"
           [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
           (mouseenter)="onMouseEnter(i)" class="ripplelink">
          <i class="material-icons">{{child.icon}}</i>
          <span class="menuitem-text">{{child.label | translate}}</span>
          <i class="material-icons layout-submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
        </a>

        <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink && !child?.hide"
           [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
           [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null"
           [attr.target]="child.target"
           (mouseenter)="onMouseEnter(i)" class="ripplelink">
          <i class="material-icons">{{child.icon}}</i>
          <span class="menuitem-text">{{child.label | translate}}</span>
          <i class="material-icons layout-submenu-toggler" *ngIf="child.items">keyboard_arrow_down</i>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
        </a>
        <ul app-theme-submenu [item]="child" *ngIf="child.items && isActive(i)" [visible]="isActive(i)" [reset]="reset"
            [parentActive]="isActive(i)" [@children]="(app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
      </li>
    </ng-template>
  `,
  animations: [
    trigger('children', [
      state('void', style({
        height: '0px'
      })),
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class ThemeSubMenuComponent implements OnInit, OnDestroy {

  public user;

  private langMap = {
    'ru': 'Русский',
    'en': 'English',
  };

  languages = ['Русский', 'English'];

  get currentLang(): string {
    return this.langMap[this.session.lang];
  }

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  constructor(public app: ThemeMainComponent,
              public router: Router,
              public location: Location,
              public appMenu: ThemeMenuComponent,
              public session: SessionService,
              private translatingService: TranslatingService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
      event.preventDefault();
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    if (item.routerLink || item.items || item.command || item.url) {
      this.activeIndex = (this.activeIndex as number === index) ? -1 : index;
    }

    // execute command
    if (item.command) {
      item.command({originalEvent: event, item});
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.appMenu.layoutMenuScrollerViewChild.moveBar();
      }, 450);

      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isMobile()) {
        this.app.sidebarActive = false;
        this.app.mobileMenuActive = false;
      }

      if (this.app.isHorizontal()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (this.root && this.app.menuHoverActive && this.app.isHorizontal()
      && !this.app.isMobile() && !this.app.isTablet()) {
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
