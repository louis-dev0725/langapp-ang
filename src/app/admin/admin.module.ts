import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from '@app/admin/admin.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      breadcrumb: 'Admin'
    },
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./admin-transactions/admin-transactions.module').then(m => m.AdminTransactionsModule)
      }
    ]
  }
];

@NgModule({
  declarations: [AdminComponent],
  imports: [RouterModule.forChild(routes), CommonModule]
})
export class AdminModule {}
