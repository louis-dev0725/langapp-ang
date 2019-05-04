import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from './login/signin/signin.component';
import {CanactivateNologged} from './services/canactivate-nologged';
import {SignupComponent} from './login/signup/signup.component';
import {RestoreComponent} from './login/restore/restore.component';
import {UsersComponent} from './users/users.component';
import {CanactivateLogged} from './services/canactivate-logged';
import {PaymentComponent} from './payment/payment.component';
import {SettingsComponent} from './users/settings/settings.component';
import {AboutComponent} from './partners/about/about.component';
import {ClientsComponent} from './partners/clients/clients.component';
import {ContactComponent} from './contact/contact.component';
import {TransactionComponent} from './partners/transaction/transaction.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [CanactivateNologged]
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [CanactivateNologged]
  },
  {
    path: 'restore',
    component: RestoreComponent,
    canActivate: [CanactivateNologged]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [CanactivateLogged]
  },
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path:'restore-password',
        component: RestoreComponent,
        canActivate: [CanactivateNologged],
        data: {mode: 'password-change'}
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [CanactivateLogged]
      }
    ]
  },
  {
    path: 'partners',
    canActivateChild: [CanactivateLogged],
    children: [
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'operations',
        component: TransactionComponent
      }
    ]
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [CanactivateNologged]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
