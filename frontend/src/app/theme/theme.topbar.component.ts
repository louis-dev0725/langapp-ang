import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppComponent } from '@app/app.component';
import { MenuItem } from 'primeng/api';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/common.interface';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-topbar',
  templateUrl: './theme.topbar.component.html',
  styleUrls: ['./menu-custom.component.scss']
})
export class ThemeTopbarComponent implements OnInit, OnDestroy {
  public user: User;
  public isLoggedIn: boolean = true;

  model: MenuItem[];
  translateModel: MenuItem[] = [];

  get isOpenedAdmin(): boolean {
    return this.userService.openedAdmin;
  }

  constructor(public appTheme: ThemeMainComponent, public session: SessionService, private userService: UserService, public api: ApiService, private cd: ChangeDetectorRef, public app: AppComponent, private translate: TranslateService) { }

  ngOnInit() {
    this.model = this.getModel();

    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      this.model = [...this.getModel()];
      this.translateModel = [...this.getTranslateModel()];
      this.cd.detectChanges();
    });

    this.translate.onLangChange.subscribe((e) => {
      this.model = [...this.getModel()];
      this.translateModel = [...this.getTranslateModel()];
      this.cd.detectChanges();
    });
  }

  public getTranslateModel(): MenuItem[] {
    let translateModel: MenuItem[] = [];
    translateModel.push({
      label: 'English',
      icon: 'c-icons icon-flag-uk',
      command: (event) => {
        this.appTheme.setLanguage('en');
      },
    });
    translateModel.push({
      label: 'Русский',
      icon: 'c-icons icon-flag-rusia',
      command: (event) => {
        this.appTheme.setLanguage('ru');
      },
    });
    return translateModel;
  }

  public getModel(): MenuItem[] {
    let model: MenuItem[] = [];

    // if (this.isLoggedIn) {
    //   model.push({
    //     label: this.translate.instant('Payment'),
    //     routerLink: ['/payment'],
    //     icon: 'c-icons icon-payment'
    //   });
    //   model.push({
    //     label: this.translate.instant('Settings'),
    //     routerLink: ['/settings/profile'],
    //   });
    // }

    if (this.isLoggedIn) {
      model.push(
        {
          label: this.translate.instant('Payment'),
          routerLink: ['/payment'],
          icon: 'c-icons icon-payment'
        },
        {
          label: this.translate.instant('Settings'),
          routerLink: ['/settings/profile'],
          icon: 'c-icons icon-settings'
        },
        {
          label: this.translate.instant('Support'),
          routerLink: ['/contacts'],
          icon: 'c-icons icon-support',
        },
        {
          label: this.translate.instant('Affiliate program'),
          icon: 'c-icons icon-affiliate',
        },
        {
          label: this.translate.instant('Logout'),
          icon: 'c-icons icon-logout',
          command: (event) => {
            this.appTheme.logout(event.originalEvent);
          },
        }
      );

      // model.push({
      //   label: this.translate.instant('Affiliate program'),
      //   icon: 'icon-affiliate',
      //   items: [
      //     {
      //       label: this.translate.instant('About'),
      //       routerLink: ['/partners/about'],
      //     },
      //     {
      //       label: this.translate.instant('Clients'),
      //       routerLink: ['/partners/clients'],
      //     },
      //     {
      //       label: this.translate.instant('Transactions'),
      //       routerLink: ['/partners/transactions'],
      //     },
      //   ],
      // });

      // model.push({
      //   label: this.translate.instant('Logout'),
      //   icon: 'icon-logout',
      //   command: (event) => {
      //     this.appTheme.logout(event.originalEvent);
      //   },
      // });


    } else {
      // model.push({
      //   label: this.translate.instant('Sign up'),
      //   routerLink: ['/auth/signup'],
      //   icon: 'c-icons icon-sign__up',
      // });
      // model.push({
      //   label: this.translate.instant('Sign in'),
      //   routerLink: ['/auth/signin'],
      //   icon: 'c-icons icon-sign__in',
      // });

      model.push(
        {
          label: this.translate.instant('Support'),
          routerLink: ['/contacts'],
          icon: 'c-icons icon-support',
        },
        {
          label: this.translate.instant('Sign up'),
          routerLink: ['/auth/signup'],
          icon: 'c-icons icon-sign__up',
        },
        {
          label: this.translate.instant('Sign in'),
          routerLink: ['/auth/signin'],
          icon: 'c-icons icon-sign__in',
        }
      );
    }

    return model;
  }

  ngOnDestroy() { }
}
