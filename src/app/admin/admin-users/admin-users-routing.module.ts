import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminUsersComponent } from '@app/admin/admin-users/admin-users.component';
import { AdmUsersLayoutComponent } from '@app/admin/admin-users/adm-users-layout/adm-users-layout.component';
import { AdmUsersComponent } from '@app/admin/admin-users/adm-users/adm-users.component';
import { AdmUserEditComponent } from '@app/admin/admin-users/adm-user-edit/adm-user-edit.component';

const adminRoutes = [
  {
    path: '',
    component: AdminUsersComponent,
    children: [
      {
        path: '',
        component: AdmUsersLayoutComponent,
        data: {
          breadcrumb: 'Users'
        },
        children: [
          {
            path: '',
            component: AdmUsersComponent,
            data: {
              breadcrumb: ''
            }
          },
          {
            path: ':id',
            component: AdmUserEditComponent,
            data: {
              breadcrumb: 'Edit'
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminUsersRoutingModule {}
