import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { PaymentRoutingModule } from '@app/payment/payment-routing.module';
import { PaymentComponent } from '@app/payment/payment.component';
import { SuccessComponent } from '@app/payment/success/success.component';
import { PaymentsTableModule } from '@app/common/payments-table/payments-table.module';
import { SquareFormComponent } from './square-form/square-form.component';

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, SquareFormComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CommonModule,
    PaymentRoutingModule,
    PaymentsTableModule,
    SharedModule
  ]
})
export class PaymentModule {}
