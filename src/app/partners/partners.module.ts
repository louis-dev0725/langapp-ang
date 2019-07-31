import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatCardModule, MatFormFieldModule, MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentsTableModule } from '../common/payments-table/payments-table.module';
import { SessionService } from '@app/services/session.service';
import { SharedModule } from "@app/shared/shared.module";
import { PartnersComponent } from "@app/partners/partners.component";
import { PartnersRoutingModule } from "@app/partners/partners-routing.module";

@NgModule({
  declarations: [
    AboutComponent,
    ClientsComponent,
    TransactionComponent,
    PartnersComponent
  ],
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
  providers: [DecimalPipe, SessionService]
})
export class PartnersModule {
}
