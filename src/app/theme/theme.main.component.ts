import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { onRandomFromRange } from '@app/helpers/randomFromRange';

@Component({
  selector: 'app-theme-main',
  templateUrl: './theme.main.component.html'
})
export class ThemeMainComponent implements OnDestroy, OnInit {
  menuClick: boolean;

  menuButtonClick: boolean;

  topbarMenuButtonClick: boolean;

  topbarMenuClick: boolean;

  topbarMenuActive: boolean;

  activeTopbarItem: Element;

  layoutMode = 'overlay';

  sidebarActive: boolean;

  mobileMenuActive: boolean;

  darkMenu: boolean;

  isRTL: boolean;

  rippleInitListener: any;

  rippleMouseDownListener: any;

  menuHoverActive: boolean;

  resetMenu: boolean;

  interval;

  constructor(public zone: NgZone, private router: Router, private api: ApiService, private sessionService: SessionService) {
    /*router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.sessionService.isLoggedIn) {
          this.api.meRequest().subscribe();
        }
      }
    });
    this.interval = setInterval(() => {
      if (this.sessionService.isLoggedIn) {
        this.api.meRequest().subscribe();
      }
    }, onRandomFromRange(500, 600));*/
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.bindRipple();
    });
  }

  bindRipple() {
    this.rippleInitListener = this.init.bind(this);
    document.addEventListener('DOMContentLoaded', this.rippleInitListener);
  }

  init() {
    this.rippleMouseDownListener = this.rippleMouseDown.bind(this);
    document.addEventListener('mousedown', this.rippleMouseDownListener, false);
  }

  rippleMouseDown(e) {
    const parentNode = 'parentNode';
    for (let target = e.target; target && target !== this; target = target[parentNode]) {
      if (!this.isVisible(target)) {
        continue;
      }

      // Element.matches() -> https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
      if (this.selectorMatches(target, '.ripplelink, .ui-button, .ui-listbox-item, .ui-multiselect-item, .ui-fieldset-toggler')) {
        const element = target;
        this.rippleEffect(element, e);
        break;
      }
    }
  }

  selectorMatches(el, selector) {
    const matches = 'matches';
    const webkitMatchesSelector = 'webkitMatchesSelector';
    const mozMatchesSelector = 'mozMatchesSelector';
    const msMatchesSelector = 'msMatchesSelector';
    const p = Element.prototype;
    const f =
      p[matches] ||
      p[webkitMatchesSelector] ||
      p[mozMatchesSelector] ||
      p[msMatchesSelector] ||
      function(s) {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
      };
    return f.call(el, selector);
  }

  isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight);
  }

  rippleEffect(element, e) {
    if (element.querySelector('.ink') === null) {
      const inkEl = document.createElement('span');
      this.addClass(inkEl, 'ink');

      if (this.hasClass(element, 'ripplelink') && element.querySelector('span')) {
        element.querySelector('span').insertAdjacentHTML('afterend', "<span class='ink'></span>");
      } else {
        element.appendChild(inkEl);
      }
    }

    const ink = element.querySelector('.ink');
    this.removeClass(ink, 'ripple-animate');

    if (!ink.offsetHeight && !ink.offsetWidth) {
      const d = Math.max(element.offsetWidth, element.offsetHeight);
      ink.style.height = d + 'px';
      ink.style.width = d + 'px';
    }

    const x = e.pageX - this.getOffset(element).left - ink.offsetWidth / 2;
    const y = e.pageY - this.getOffset(element).top - ink.offsetHeight / 2;

    ink.style.top = y + 'px';
    ink.style.left = x + 'px';
    ink.style.pointerEvents = 'none';
    this.addClass(ink, 'ripple-animate');
  }

  hasClass(element, className) {
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
  }

  addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }

  removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
    };
  }

  unbindRipple() {
    if (this.rippleInitListener) {
      document.removeEventListener('DOMContentLoaded', this.rippleInitListener);
    }
    if (this.rippleMouseDownListener) {
      document.removeEventListener('mousedown', this.rippleMouseDownListener);
    }
  }

  ngOnDestroy() {
    this.unbindRipple();
    clearInterval(this.interval);
  }

  onWrapperClick() {
    if (!this.menuClick && !this.menuButtonClick) {
      this.mobileMenuActive = false;
    }

    if (!this.topbarMenuClick && !this.topbarMenuButtonClick) {
      this.topbarMenuActive = false;
      this.activeTopbarItem = null;
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isOverlay()) {
        this.resetMenu = true;
      }

      this.menuHoverActive = false;
    }

    this.menuClick = false;
    this.menuButtonClick = false;
    this.topbarMenuClick = false;
    this.topbarMenuButtonClick = false;
  }

  onMenuButtonClick(event: Event) {
    this.menuButtonClick = true;

    if (this.isMobile()) {
      this.mobileMenuActive = !this.mobileMenuActive;
    }

    event.preventDefault();
  }

  onTopbarMobileMenuButtonClick(event: Event) {
    this.topbarMenuButtonClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;
    event.preventDefault();
  }

  onTopbarRootItemClick(event: Event, item: Element) {
    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  onTopbarMenuClick(event: Event) {
    this.topbarMenuClick = true;
  }

  onSidebarClick(event: Event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onToggleMenuClick(event: Event) {
    this.layoutMode = this.layoutMode !== 'static' ? 'static' : 'overlay';
    event.preventDefault();
  }

  isMobile() {
    return window.innerWidth <= 1024;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isHorizontal() {
    return this.layoutMode === 'horizontal';
  }

  isOverlay() {
    return this.layoutMode === 'overlay';
  }
}
