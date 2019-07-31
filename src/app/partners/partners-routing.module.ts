import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AboutComponent } from "@app/partners/about/about.component";
import { ClientsComponent } from "@app/partners/clients/clients.component";
import { TransactionComponent } from "@app/partners/transaction/transaction.component";
import { CanactivateLogged } from "@app/services/canactivate-logged";
import { PartnersComponent } from "@app/partners/partners.component";
const authRoutes = [
  {
    path: '',
    component: PartnersComponent,
    canActivate: [CanactivateLogged],
    children: [
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'transactions',
        component: TransactionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class PartnersRoutingModule { }
