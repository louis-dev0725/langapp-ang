import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanactivateLogged } from './services/canactivate-logged';
import { PaymentComponent } from './payment/payment.component';
import { ContactComponent } from './contact/contact.component';
import { CanactivateAdmin } from './services/canactivate-admin';
import { SuccessComponent } from '@app/payment/success/success.component';
import { ContentPageComponent } from '@app/content-page/content-page.component';
import { AboutComponent } from '@app/partners/about/about.component';
import { CanactivateNologged } from '@app/services/canactivate-nologged';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [CanactivateAdmin],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    canActivate: [CanactivateNologged],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'partners',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule)
  },
  {
    path: 'users',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'payment',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'content-page',
    component: ContentPageComponent,
    data: {
      breadcrumb: 'Content-page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
