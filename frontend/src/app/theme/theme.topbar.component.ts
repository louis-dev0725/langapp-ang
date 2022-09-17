import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppComponent } from '@app/app.component';
import { MenuItem } from 'primeng/api';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/common.interface';

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

  constructor(public appTheme: ThemeMainComponent, public session: SessionService, private userService: UserService, public api: ApiService, private cd: ChangeDetectorRef, public app: AppComponent) {}

  ngOnInit() {
    this.model = this.getModel();

    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.isLoggedIn = user != null;
      this.model = [...this.getModel()];
      this.cd.detectChanges();
    });
  }

  public getModel(): MenuItem[] {
    let model: MenuItem[] = [];

    model.push({
      label: 'Language',
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
        label: 'Payment',
        routerLink: ['/payment'],
      });
      model.push({
        label: 'Settings',
        routerLink: ['/settings/profile'],
      });
    }

    model.push({
      label: 'Support',
      routerLink: ['/contacts'],
    });

    if (this.isLoggedIn) {
      model.push({
        label: 'Affiliate program',
        items: [
          {
            label: 'About',
            routerLink: ['/partners/about'],
          },
          {
            label: 'Clients',
            routerLink: ['/partners/clients'],
          },
          {
            label: 'Transactions',
            routerLink: ['/partners/transactions'],
          },
        ],
      });

      model.push({
        label: 'Logout',
        command: (event) => {
          this.appTheme.logout(event.originalEvent);
        },
      });
    } else {
      model.push({
        label: 'Sign up',
        routerLink: ['/auth/signup'],
      });
      model.push({
        label: 'Sign in',
        routerLink: ['/auth/signin'],
      });
    }

    return model;
  }

  ngOnDestroy() {}
}
