/*
 *  @file payments-table.module.ts
 *  @author shrewmus (contact@shrewmus.name, shrewmus@gmail.com)
 *  Date: 5/4/2019
 *  (c): 2019
 */

import {NgModule} from '@angular/core';
import {PaymentsTableComponent} from './payments-table.component';
import {MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [PaymentsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatPaginatorModule
  ],
  exports: [PaymentsTableComponent]
})
export class PaymentsTableModule {

}
