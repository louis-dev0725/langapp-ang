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
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '../../environments/environment';
import { StripeFormComponent } from './stripe-form/stripe-form.component';

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, SquareFormComponent, StripeFormComponent],
  imports: [FormsModule, ReactiveFormsModule, TranslateModule.forChild(), CommonModule, PaymentRoutingModule, PaymentsTableModule, SharedModule, NgxStripeModule.forRoot(environment.stripe[environment.stripe.env].publishableKey)],
})
export class PaymentModule {}
