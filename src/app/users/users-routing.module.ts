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
    data: {
      breadcrumb: 'Users'
    },
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [CanactivateLogged],
        data: {
          breadcrumb: 'Settings'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
