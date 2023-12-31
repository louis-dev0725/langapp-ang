/*
 *  @file payments-table.module.ts
 *  @author shrewmus (contact@shrewmus.name, shrewmus@gmail.com)
 *  Date: 5/4/2019
 *  (c): 2019
 */

import { NgModule } from '@angular/core';
import { PaymentsTableComponent } from '@app/common/payments-table/payments-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [PaymentsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  exports: [PaymentsTableComponent]
})
export class PaymentsTableModule {}
