import { NgModule } from '@angular/core';
import { CanactivateLogged } from "@app/services/canactivate-logged";
import { RouterModule } from "@angular/router";
import { UsersComponent } from "@app/users/users.component";
import { SettingsComponent } from "@app/users/settings/settings.component";

const usersRoutes = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [CanactivateLogged],
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [CanactivateLogged]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
