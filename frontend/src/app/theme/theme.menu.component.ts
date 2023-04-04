import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { APP_NAME } from '@app/config/config';
import { ApiService } from '@app/services/api.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { fromEvent } from 'rxjs';

import { AppComponent } from '@app/app.component';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/common.interface';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './theme.menu.component.html',
})
export class ThemeMenuComponent implements OnInit {
  model: MenuItem[];
  otherModel: MenuItem[];

  public appName = APP_NAME;
  public user: User;
  public isLoggedIn: boolean;

  desktopLayer: boolean = false;

  constructor(public app: AppComponent, public appTheme: ThemeMainComponent, public api: ApiService, public session: SessionService, private userService: UserService, private cd: ChangeDetectorRef, private translate: TranslateService) {

    if (window.innerWidth >= 1024) {
      this.desktopLayer = true;
    } else {
      this.desktopLayer = false;
    }
  }

  ngOnInit() {
    this.subscribeToWindowResize();
    this.subscribeToUser();
  }

  get isOpenedAdmin(): boolean {
    return this.userService.openedAdmin;
  }

  get isAdmin(): boolean {
    return this.session.isAdmin;
  }

  trackByIdentify(index: number, item: any) {
    return item.id ?? item.label;
  }

  isDesktop() {
    return window.innerWidth >= 1024;
  }

  public getModel(): MenuItem[] {
    let menuItems: MenuItem[] = [
      {
        label: 'Admin',
        visible: this.isAdmin && !this.isOpenedAdmin,
        items: [
          {
            label: 'Clients',
            routerLink: ['/admin/users'],
          },
          {
            label: 'Transactions',
            routerLink: ['/admin/transactions'],
          },
          {
            label: 'Content categories',
            routerLink: ['/category'],
          },
        ],
      },
      {
        label: 'Learning',
        visible: this.isLoggedIn,
        items: [
          // {
          //   label: 'Study new words',
          //   routerLink: ['/training'],
          //   icon: 'c-icons icon-study'
          // },
          // {
          //   label: 'Explore content',
          //   routerLink: ['/content/materials'],
          //   icon: 'c-icons icon-explorecontent'
          // },
          /*{
            label: 'Create material',
            routerLink: ['/content/create']
          },*/
          // {
          //   label: 'My word list',
          //   routerLink: ['/dictionary'],
          //   icon: 'c-icons icon-wordlist'
          // },

          {
            label: 'Home',
            routerLink: ['/content/materials'],
            icon: 'c-icons icon-home',
          },
          {
            label: 'Study',
            routerLink: ['/training'],
            icon: 'c-icons icon-study'
          },
          {
            label: 'Explore',
            routerLink: ['/content/create'],
            icon: 'c-icons icon-explorecontent'
          },
          {
            label: 'Words',
            routerLink: ['/dictionary'],
            icon: 'c-icons icon-wordlist'
          }
        ],
      },
      {
        label: 'Account',
        visible: !this.isLoggedIn,
        items: [
          {
            label: 'Settings',
            routerLink: ['/settings/profile'],
            // visible: this.isLoggedIn,
            visible: this.isAdmin && !this.isOpenedAdmin,
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
            visible: !this.isLoggedIn,
            icon: 'c-icons icon-sign__up',
          },
          {
            label: 'Sign in',
            routerLink: ['/auth/signin'],
            visible: !this.isLoggedIn,
            icon: 'c-icons icon-sign__in',
          },
          /*{
            label: 'Logout',
            visible: this.isLoggedIn,
            command: event => {
              this.appTheme.logout();
            }
          }*/
        ],
      },
    ];

    // if (!this.isDesktop()) {
    //   menuItems.push({
    //     label: 'Legal',
    //     items: [
    //       {
    //         label: 'Terms of Use',
    //         url: '/docs/terms-of-use.pdf',
    //         target: '_blank',
    //       },
    //       {
    //         label: 'Privacy policy',
    //         url: '/docs/privacy-policy.pdf',
    //         target: '_blank',
    //       },
    //       {
    //         label: 'Tokushoho', // 特定商取引に関する法律に基づく表記
    //         url: '/docs/tokutei.pdf',
    //         target: '_blank',
    //       },
    //     ],
    //   });
    // }

    return menuItems;
  }

  public getOtherModel(): MenuItem[] {
    let menuItems: MenuItem[] = [
      {
        label: 'Other',
        items: [
          {
            label: 'Settings',
            routerLink: ['/settings/profile'],
            icon: 'c-icons icon-settings',
            visible: this.isLoggedIn,
          },
          {
            label: 'Support',
            routerLink: ['/contacts'],
            icon: 'c-icons icon-support',
          },
        ],
      },
    ];

    return menuItems;
  }

  private subscribeToWindowResize() {
    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this))
      .subscribe((e) => {
        this.model = this.getModel();
        this.otherModel = [...this.getOtherModel()];
        this.cd.markForCheck();
      });
  }

  private subscribeToUser(): void {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      this.model = [...this.getModel()];
      this.otherModel = [...this.getOtherModel()];
      this.cd.detectChanges();
    });
  }
}
