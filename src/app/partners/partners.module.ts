import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AboutComponent } from '@src/app/partners/about/about.component';
import { RouterModule } from '@angular/router';
import { ClientsComponent } from '@src/app/partners/clients/clients.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule } from '@angular/material';
import { TransactionComponent } from '@src/app/partners/transaction/transaction.component';
import { PaymentsTableModule } from '@src/app/common/payments-table/payments-table.module';
import { SharedModule } from '@app/shared/shared.module';
import { PartnersComponent } from '@app/partners/partners.component';
import { PartnersRoutingModule } from '@app/partners/partners-routing.module';

@NgModule({
  declarations: [AboutComponent, ClientsComponent, TransactionComponent, PartnersComponent],
  imports: [
    CommonModule,
    RouterModule,
    PaymentsTableModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule,
    PartnersRoutingModule
  ],
  providers: [DecimalPipe]
})
export class PartnersModule {}
