import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { CanactivateNologged } from '@src/app/guards/canactivate-nologged';

export const routes: Routes = [{
  path: 'auth',
  canActivate: [CanactivateNologged],
  loadChildren: () => import('./auth/auth.module.tns').then(m => m.AuthModule)
}, {
  path: '',
  redirectTo: '/auth/signin',
  pathMatch: 'full'
}];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
