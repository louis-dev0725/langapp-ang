import { NgModule } from '@angular/core';
import { CanactivateNologged } from "@app/services/canactivate-nologged";
import { SignupComponent } from "@app/auth/signup/signup.component";
import { SigninComponent } from "@app/auth/signin/signin.component";
import { RouterModule } from "@angular/router";
import { RestoreComponent } from "@app/auth/restore/restore.component";
import { AuthComponent } from "@app/auth/auth.component";

const authRoutes = [

  {
    path: '',
    component: AuthComponent,
    canActivate: [CanactivateNologged],
    children: [
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'restore',
        component: RestoreComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
