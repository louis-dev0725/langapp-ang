import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanactivateLogged } from './guards/canactivate-logged';
import { CanactivateAdmin } from './guards/canactivate-admin';
import { CanactivateNologged } from '@app/guards/canactivate-nologged';

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
    path: 'settings',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
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
    path: 'content',
    canActivate: [CanactivateLogged],
    loadChildren: () => import('./content/content.module').then(m => m.ContentModule)
  },
  {
    path: 'category',
    canActivate: [CanactivateAdmin],
    loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
  },
  {path: '', redirectTo: '/auth/signin', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
