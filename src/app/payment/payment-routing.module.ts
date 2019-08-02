import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { PaymentComponent } from "@app/payment/payment.component";
import { SuccessComponent } from "@app/payment/success/success.component";
const paymentsRoutes = [
  {
    path: '',
    component: PaymentComponent,
    data: {
      breadcrumb: 'Payment'
    },

  },
  /*{
    path: 'success',
    component: SuccessComponent,
    data: {
      breadcrumb: 'Payment success'
    }
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(paymentsRoutes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule { }
