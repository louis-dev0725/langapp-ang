import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import { AboutComponent } from './about/about.component';
import {RouterModule} from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import {PaymentsTableModule} from '../common/payments-table/payments-table.module';

@NgModule({
  declarations: [AboutComponent, ClientsComponent, TransactionComponent],
  imports: [
    CommonModule,
    RouterModule,
    PaymentsTableModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  providers: [DecimalPipe]
})
export class PartnersModule { }
