import { NgModule } from '@angular/core';
import { SignupComponent } from '@app/auth/signup/signup.component';
import { SigninComponent } from '@app/auth/signin/signin.component';
import { RouterModule } from '@angular/router';
import { RestoreComponent } from '@app/auth/restore/restore.component';
import { AuthComponent } from '@app/auth/auth.component';

const authRoutes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'signup',
        component: SignupComponent,
        data: {
          breadcrumb: 'Sign up'
        }
      },
      {
        path: 'signin',
        component: SigninComponent,
        data: {
          breadcrumb: 'Sign in'
        }
      },
      {
        path: 'restore',
        component: RestoreComponent,
        data: {
          breadcrumb: 'Restore password'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
