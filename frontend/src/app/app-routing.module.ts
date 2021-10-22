import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanactivateAdmin } from '@app/guards/canactivate-admin';
import { CanactivateNologged } from '@app/guards/canactivate-nologged';
import { CanactivateLogged } from '@app/guards/canactivate-logged';
import { ThemeMainComponent } from '@app/theme/theme.main.component';

const routes: Routes = [{
  path: 'admin',
  canActivate: [CanactivateAdmin],
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}, {
  path: 'auth',
  canActivate: [CanactivateNologged],
  loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
}, {
  path: 'partners',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule)
}, {
  path: 'settings',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
}, {
  path: 'contacts',
  loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
}, {
  path: 'dictionary',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./dictionary/dictionary.module').then(m => m.DictionaryModule)
}, {
  path: 'training',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./training/training.module').then(m => m.TrainingModule)
}, {
  path: 'payment',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
}, {
  path: 'content',
  canActivate: [CanactivateLogged],
  loadChildren: () => import('./content/content.module').then(m => m.ContentModule)
}, {
  path: 'category',
  canActivate: [CanactivateAdmin],
  loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
}];

const rootRoutes: Routes = [
  {
    path: '',
    redirectTo: '/content/materials',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ThemeMainComponent,
    children: routes,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(rootRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
