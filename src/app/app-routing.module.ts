import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from "./login/signin/signin.component";
import {CanactivateNologged} from "./services/canactivate-nologged";
import {SignupComponent} from "./login/signup/signup.component";
import {RestoreComponent} from "./login/restore/restore.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
