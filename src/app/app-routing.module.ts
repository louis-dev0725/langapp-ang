import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CanactivateLogged} from './services/canactivate-logged';
import {PaymentComponent} from './payment/payment.component';
import {ContactComponent} from './contact/contact.component';
import {CanactivateAdmin} from './services/canactivate-admin';
import {SuccessComponent} from '@app/payment/success/success.component';
import { ContentPageComponent } from "@app/content-page/content-page.component";

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [CanactivateAdmin],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'partners',
    loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule)
  },
  {
    path: 'users',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [CanactivateLogged]
  },
  {
    path: 'payment-success',
    component: SuccessComponent,
    canActivate: [CanactivateLogged]
  },
  {
    path: 'contacts',
    component: ContactComponent,
  },
  {
    path: 'content-page',
    component: ContentPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
