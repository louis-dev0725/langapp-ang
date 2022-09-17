import { Component, OnDestroy, OnInit, NgZone, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppComponent } from '@app/app.component';
import { MenuService } from '@app/theme/theme.menu.service';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@app/services/user.service';
import { EventsService } from '@app/services/events.service';

@UntilDestroy()
@Component({
  selector: 'app-theme-main',
  templateUrl: './theme.main.component.html',
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

  isProgressBarLoading = false;

  public isLoggedIn: boolean;

  languages = ['Русский', 'English'];

  constructor(public zone: NgZone, private router: Router, private userService: UserService, private api: ApiService, private sessionService: SessionService, public renderer: Renderer2, private menuService: MenuService, private translateService: TranslateService, private eventsService: EventsService, private primengConfig: PrimeNGConfig, private confirmDialog: MatDialog, public app: AppComponent, private confirmationService: ConfirmationService) {}

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

  setLanguage(lang: string) {
    this.userService.changeLanguage(lang);
  }

  get isOpenedAdmin(): boolean {
    return this.userService.openedAdmin;
  }

  logout(event: MouseEvent) {
    if (!this.isOpenedAdmin) {
      this.confirmationService.confirm({
        target: event.target,
        message: this.translateService.instant('Logout confirm title'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.userService.logout();
          window.postMessage({ type: 'Logout', text: 'Logout' }, '*');
        },
        reject: () => {},
      });
    } else {
      this.userService.logout();
      window.postMessage({ type: 'Logout', text: 'Logout' }, '*');
    }
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
    return window.innerWidth > 991;
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
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  ngOnInit() {
    this.eventsService.progressBarLoading.pipe(untilDestroyed(this)).subscribe((event: boolean) => {
      this.isProgressBarLoading = event;
    });
  }
}
