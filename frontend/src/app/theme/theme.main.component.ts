import { Component, OnDestroy, OnInit, NgZone, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { randomFromRange } from '@app/shared/helpers';
import { Observable } from 'rxjs';
import * as fromStore from '@app/store';
import { getAuthorizedIsLoggedIn } from '@app/store/selectors/authorized.selector';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppComponent } from '@app/app.component';
import { MenuService } from '@app/theme/theme.menu.service';
import { PrimeNGConfig } from 'primeng/api';
import { UserService } from '@app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '@app/event.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'app-theme-main',
  templateUrl: './theme.main.component.html'
})
export class ThemeMainComponent implements OnDestroy, OnInit {
  rotateMenuButton: boolean;

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: Element;

  documentClickListener: () => void;

  configActive: boolean;

  configClick: boolean;

  rightPanelActive: boolean;

  rightPanelClick: boolean;

  menuHoverActive = false;

  searchClick = false;

  search = false;

  interval;
  private isLoggedIn$: Observable<boolean> = this.store.select(getAuthorizedIsLoggedIn);
  public isLoggedIn: boolean;

  languages = ['Русский', 'English'];

  constructor(public zone: NgZone,
    private store: Store<fromStore.State>,
    private router: Router,
    private api: ApiService,
    private sessionService: SessionService,
    public renderer: Renderer2,
    private menuService: MenuService,
    private userService: UserService,
    private translateService: TranslateService,
    private eventService: EventService,
    private primengConfig: PrimeNGConfig,
    private confirmDialog: MatDialog,
    public app: AppComponent) {
    this.setUpSubscriptions();
  }

  ngAfterViewInit() {
    // hides the horizontal submenus or top menu if outside is clicked
    this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
      if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
      }

      if (!this.menuClick && this.isHorizontal()) {
        this.menuService.reset();
      }

      if (this.configActive && !this.configClick) {
        this.configActive = false;
      }

      if (!this.rightPanelClick) {
        this.rightPanelActive = false;
      }

      if (!this.menuClick) {
        if (this.overlayMenuActive) {
          this.overlayMenuActive = false;
        }
        if (this.staticMenuMobileActive) {
          this.staticMenuMobileActive = false;
        }

        this.menuHoverActive = false;
        this.unblockBodyScroll();
      }

      if (!this.searchClick) {
        this.search = false;
      }

      this.searchClick = false;
      this.configClick = false;
      this.topbarItemClick = false;
      this.menuClick = false;
      this.rightPanelClick = false;
    });
  }

  setLanguage(lang: any) {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    this.eventService.emitChangeEvent({ type: 'language-change' });
    if (this.sessionService.user !== null) {
      this.sessionService.changeUserLanguage(lang);
      const user = this.sessionService.user;
      this.api.updateUser({ id: user.id, language: user.language }).pipe(untilDestroyed(this)).subscribe(() => { });
    }
  }

  get isOpenedAdmin(): boolean {
    return this.sessionService.openedAdmin;
  }

  logout() {
    if (!this.isOpenedAdmin) {
      const dialogModel = new ConfirmDialogModel(
        this.translateService.instant('Logout confirm title'),
        this.translateService.instant('Logout confirm msg')
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

  onMenuButtonClick(event) {
    this.rotateMenuButton = !this.rotateMenuButton;
    this.topbarMenuActive = false;
    this.menuClick = true;

    if (this.app.menuMode === 'overlay' && !this.isMobile()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }

    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
      if (this.staticMenuMobileActive) {
        this.blockBodyScroll();
      } else {
        this.unblockBodyScroll();
      }
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    if (item.className === 'search-item topbar-item') {
      this.search = !this.search;
      this.searchClick = !this.searchClick;
    }

    event.preventDefault();
  }

  onTopbarSubItemClick(event) {
    event.preventDefault();
  }

  onRTLChange(event) {
    this.app.isRTL = event.checked;
  }

  onRippleChange(event) {
    //this.app.ripple = event.checked;
    this.primengConfig.ripple = event.checked;
  }

  onConfigClick(event) {
    this.configClick = true;
  }

  onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.app.menuMode === 'overlay';
  }

  isStatic() {
    return this.app.menuMode === 'static';
  }

  isHorizontal() {
    return this.app.menuMode === 'horizontal';
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
        'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
    });
    this.setUpSubscriptions();
  }

  setUpSubscriptions() {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationStart) {
        if (this.isLoggedIn) {
          this.api.meRequest().pipe(untilDestroyed(this)).subscribe();
        }
      }
    });
    this.interval = setInterval(async () => {
      const isLoggedIn = await this.isLoggedIn$.toPromise();
      if (isLoggedIn) {
        this.api.meRequest().pipe(untilDestroyed(this)).subscribe();
      }
    }, randomFromRange(500, 600));
  }
}
