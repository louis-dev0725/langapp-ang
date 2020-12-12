import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersComponent } from '@app/admin/admin-users/admin-users.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from '@app/common/confirm-dialog/confirm-dialog.module';
import { SharedModule } from '@app/shared/shared.module';
import { AdmUserEditComponent } from '@app/admin/admin-users/adm-user-edit/adm-user-edit.component';
import { AdmUsersLayoutComponent } from '@app/admin/admin-users/adm-users-layout/adm-users-layout.component';
import { AdminUsersRoutingModule } from '@app/admin/admin-users/admin-users-routing.module';
import { AdmUsersComponent } from '@app/admin/admin-users/adm-users/adm-users.component';

@NgModule({
  declarations: [AdminUsersComponent, AdmUsersComponent, AdmUserEditComponent, AdmUsersLayoutComponent],
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
    AdminUsersRoutingModule
  ]
})
export class AdminUsersModule {}
