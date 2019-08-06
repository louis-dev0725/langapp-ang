import { NgModule } from '@angular/core';
import { CanactivateLogged } from '@app/services/canactivate-logged';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from '@app/settings/settings.component';
import { ProfileComponent } from '@app/settings/profile/profile.component';

const settingsRoutes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [CanactivateLogged],
    data: {
      breadcrumb: 'Settings'
    },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          breadcrumb: 'Profile'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
