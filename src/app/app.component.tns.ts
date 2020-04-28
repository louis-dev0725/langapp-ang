import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular';
import { SwipeGestureEventData } from 'tns-core-modules/ui/gestures';
import * as app from 'tns-core-modules/application';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.tns.html',
})

export class AppComponent implements AfterViewInit {
  @ViewChild(RadSideDrawerComponent, { static: false }) drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  constructor () {
  }

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
  }

  onSwipe(args: SwipeGestureEventData) {
      this.openDrawer();
  }

  openDrawer() {
    this.drawer.showDrawer();
  }
  closeDrawer() {
    this.drawer.closeDrawer();
  }
}
