import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { SwipeGestureEventData } from 'tns-core-modules/ui/gestures';
import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbsService } from '@app/services/bread-crumbs.service';
import { EventsService } from '@app/services/events.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as localStorage from 'nativescript-localstorage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.tns.html',
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(RadSideDrawerComponent, { static: false }) drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  public isProgressBarLoading = false;

  title = 'call-rocket';

  constructor(private translate: TranslateService, private breadCrumbsService: BreadCrumbsService,
    private eventsService: EventsService) {
    const langMap = {
      'ru-RU': 'ru',
      'en-US': 'en'
    };
    let langVal = localStorage.getItem('lang');
    if (!langVal) {
      langVal = navigator.language;
      if (langMap[langVal]) {
        langVal = langMap[langVal];
      }
      if (langVal !== 'ru' && langVal !== 'en') {
        langVal = 'en';
      }
      localStorage.setItem('lang', langVal);
    }
    this.translate.setDefaultLang(langVal);
  }

  ngOnInit (): void {
    this.eventsService.progressBarLoading.pipe(untilDestroyed(this)).subscribe((event: boolean) => {
      this.isProgressBarLoading = event;
    });
    this.breadCrumbsService.initBreadCrumbs();
  }

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
  }

  ngOnDestroy (): void {}

  onSwipe(args: SwipeGestureEventData) {
    if (args.direction === 1) {
      this.openDrawer();
    }
  }

  openDrawer() {
    this.drawer.showDrawer();
  }

  closeDrawer() {
    this.drawer.closeDrawer();
  }
}
