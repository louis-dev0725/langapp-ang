import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from '@app/contact/contact.component';

const contactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    data: {
      breadcrumb: 'Contacts'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(contactRoutes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}
