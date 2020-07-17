import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminTransactionsComponent } from '@app/admin/admin-transactions/admin-transactions.component';
import { AdmTransactionsLayoutComponent } from '@app/admin/admin-transactions/adm-transactions-layout/adm-transactions-layout.component';
import { AdmTransactionsComponent } from '@app/admin/admin-transactions/adm-transactions/adm-transactions.component';
import { AddTransactionComponent } from '@app/admin/admin-transactions/add-transaction/add-transaction.component';
import { AdmTransactionEditComponent } from '@app/admin/admin-transactions/adm-transaction-edit/adm-transaction-edit.component';

const transactionsRoutes = [
  {
    path: '',
    component: AdminTransactionsComponent,
    children: [
      {
        path: '',
        component: AdmTransactionsLayoutComponent,
        data: {
          breadcrumb: 'Transactions'
        },
        children: [
          {
            path: '',
            component: AdmTransactionsComponent,
            data: {
              breadcrumb: ''
            }
          },
          {
            path: 'create',
            component: AddTransactionComponent,
            data: {
              breadcrumb: 'Add transaction'
            }
          },
          {
            path: ':id',
            component: AdmTransactionEditComponent,
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
  imports: [RouterModule.forChild(transactionsRoutes)],
  exports: [RouterModule]
})
export class AdminTransactionsRoutingModule {}
