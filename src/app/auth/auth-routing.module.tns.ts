import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { AuthComponent } from '@src/app/auth/auth.component';
//import { SignupComponent } from '@src/app/auth/signup/signup.component.tns';
import { SigninComponent } from '@src/app/auth/signin/signin.component.tns';
//import { RestoreComponent } from '@src/app/auth/restore/restore.component.tns';

const authRoutes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      //{
      //  path: 'signup',
      //  component: SignupComponent,
      //  data: {
      //    breadcrumb: 'Sign up'
      //  }
      //},
      {
        path: 'signin',
        component: SigninComponent,
        data: {
          breadcrumb: 'Sign in'
        }
      },
      //{
      //  path: 'restore',
      //  component: RestoreComponent,
      //  data: {
      //    breadcrumb: 'Restore password'
      //  }
      //}
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(authRoutes)],
  exports: [NativeScriptRouterModule]
})
export class AuthRoutingModule {}
