import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatCardModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentsTableModule } from '../common/payments-table/payments-table.module';
import { SessionService } from '@app/services/session.service';
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [
    AboutComponent,
    ClientsComponent,
    TransactionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PaymentsTableModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  providers: [DecimalPipe, SessionService]
})
export class PartnersModule {
}
