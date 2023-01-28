import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '@app/partners/about/about.component';
import { ClientsComponent } from '@app/partners/clients/clients.component';
import { TransactionComponent } from '@app/partners/transaction/transaction.component';
import { PartnersComponent } from '@app/partners/partners.component';
const partnersRoutes: Routes = [
  {
    path: '',
    component: PartnersComponent,
    data: {
      breadcrumb: 'Partners'
    },
    children: [
      {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: 'About'
        }
      },
      {
        path: 'clients',
        component: ClientsComponent,
        data: {
          breadcrumb: 'Clients'
        }
      },
      {
        path: 'transactions',
        component: TransactionComponent,
        data: {
          breadcrumb: 'Transactions'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(partnersRoutes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule {}
