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
})
export class ThemeTopbarComponent implements OnInit, OnDestroy {
  public user: User;
  public isLoggedIn: boolean;

  model: MenuItem[];

  get isOpenedAdmin(): boolean {
    return this.userService.openedAdmin;
  }

  constructor(public appTheme: ThemeMainComponent, public session: SessionService, private userService: UserService, public api: ApiService, private cd: ChangeDetectorRef, public app: AppComponent, private translate: TranslateService) {}

  ngOnInit() {
    this.model = this.getModel();

    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      this.model = [...this.getModel()];
      this.cd.detectChanges();
    });

    this.translate.onLangChange.subscribe((e) => {
      this.model = [...this.getModel()];
      this.cd.detectChanges();
    });
  }

  public getModel(): MenuItem[] {
    let model: MenuItem[] = [];

    model.push({
      label: this.translate.instant('Language'),
      items: [
        {
          label: 'Русский',
          command: (event) => {
            this.appTheme.setLanguage('ru');
          },
        },
        {
          label: 'English',
          command: (event) => {
            this.appTheme.setLanguage('en');
          },
        },
      ],
    });

    if (this.isLoggedIn) {
      model.push({
        label: this.translate.instant('Payment'),
        routerLink: ['/payment'],
      });
      model.push({
        label: this.translate.instant('Settings'),
        routerLink: ['/settings/profile'],
      });
    }

    model.push({
      label: this.translate.instant('Support'),
      routerLink: ['/contacts'],
    });

    if (this.isLoggedIn) {
      model.push({
        label: this.translate.instant('Affiliate program'),
        items: [
          {
            label: this.translate.instant('About'),
            routerLink: ['/partners/about'],
          },
          {
            label: this.translate.instant('Clients'),
            routerLink: ['/partners/clients'],
          },
          {
            label: this.translate.instant('Transactions'),
            routerLink: ['/partners/transactions'],
          },
        ],
      });

      model.push({
        label: this.translate.instant('Logout'),
        command: (event) => {
          this.appTheme.logout(event.originalEvent);
        },
      });
    } else {
      model.push({
        label: this.translate.instant('Sign up'),
        routerLink: ['/auth/signup'],
      });
      model.push({
        label: this.translate.instant('Sign in'),
        routerLink: ['/auth/signin'],
      });
    }

    return model;
  }

  ngOnDestroy() {}
}
