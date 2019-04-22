import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from "./signin/signin.component";

const routes: Routes = [
  {
    path: 'signup', component: SigninComponent, data: {mode: 'signup'}
  },
  {
    path: 'signin', component: SigninComponent, data: {mode: 'signin'}
  },
  {
    path: 'restore', component: SigninComponent, data: {mode: 'restore'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
