import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTransactionsComponent } from '@app/admin/admin-transactions/admin-transactions.component';
import { AdminTransactionsRoutingModule } from '@app/admin/admin-transactions/admin-transactions-routing.module';
import { AdmTransactionsLayoutComponent
} from '@app/admin/admin-transactions/adm-transactions-layout/adm-transactions-layout.component';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from '@app/common/confirm-dialog/confirm-dialog.module';
import { SharedModule } from '@app/shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AddTransactionComponent } from '@app/admin/admin-transactions/add-transaction/add-transaction.component';
import {
  AdmTransactionEditComponent
} from '@app/admin/admin-transactions/adm-transaction-edit/adm-transaction-edit.component';
import { AdmTransactionsComponent } from '@app/admin/admin-transactions/adm-transactions/adm-transactions.component';

@NgModule({
  declarations: [
    AddTransactionComponent,
    AdmTransactionEditComponent,
    AdmTransactionsComponent,
    AdmTransactionsLayoutComponent,
    AdminTransactionsComponent
  ],
  imports: [
    CommonModule,
    FlexModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    AdminTransactionsRoutingModule
  ]
})
export class AdminTransactionsModule {}
