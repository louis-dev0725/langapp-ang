import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminComponent } from '@app/admin/admin.component';


const routes: Routes = [{
  path: '',
  component: AdminComponent,
  data: {
    breadcrumb: 'Admin'
  },
  children: [{
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }, {
    path: 'users',
    loadChildren: () => import('@app/admin/admin-users/admin-users.module').then(m => m.AdminUsersModule)
  }, {
    path: 'transactions',
    loadChildren: () => import('@app/admin/admin-transactions/admin-transactions.module').then(m => m.AdminTransactionsModule)
  }]
}];

@NgModule({
  declarations: [AdminComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class AdminModule {}
