import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatIconModule,
  MatInputModule, MatNativeDateModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmUsersComponent } from './adm-users/adm-users.component';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdmUserEditComponent } from './adm-user-edit/adm-user-edit.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AdmTransactionsComponent } from './adm-transactions/adm-transactions.component';
import { AdmTransactionEditComponent } from './adm-transaction-edit/adm-transaction-edit.component';
import { ConfirmDialogModule } from '@app/common/confirm-dialog/confirm-dialog.module';
import { SharedModule } from "@app/shared/shared.module";
import { AdminComponent } from "@app/admin/admin.component";
import { AdmUsersPageComponent } from './adm-users-page/adm-users-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    /*data: {
      breadcrumb: 'Admin'
    },*/
    children: [
      {
        path: 'users',
        component: AdmUsersPageComponent,
        children: [
          {
            path: '',
            component: AdmUsersComponent,
            data: {
              breadcrumb: 'Users'
            }
          },
        ]
      },
      {
        path: 'user/:id',
        component: AdmUserEditComponent,
        data: {
          breadcrumb: 'Users'
        }
      },
      {
        path: 'create-transaction',
        component: AddTransactionComponent,
        data: {
          breadcrumb: 'Create transaction'
        }
      },
      {
        path: 'transactions',
        component: AdmTransactionsComponent,
        data: {
          breadcrumb: 'Transactions'
        }
      },
      {
        path: 'transaction/:id',
        component: AdmTransactionEditComponent,
        data: {
          breadcrumb: 'Transactions'
        }
      }
    ]
  },
];

@NgModule({
  declarations: [
    AdmUsersComponent,
    AdmUserEditComponent,
    AddTransactionComponent,
    AdmTransactionsComponent,
    AdmTransactionEditComponent,
    AdminComponent,
    AdmUsersPageComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    FlexModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmDialogModule,
    SharedModule
  ]
})
export class AdminModule {
}
