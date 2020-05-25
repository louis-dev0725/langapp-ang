import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionaryComponent } from '@app/dictionary/dictionary.component';
import { CanactivateLogged } from '@app/guards/canactivate-logged';

const dictionaryRoutes: Routes = [
  {
    path: '',
    component: DictionaryComponent,
    canActivate: [CanactivateLogged],
    data: {
      breadcrumb: 'Dictionary'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(dictionaryRoutes)],
  exports: [RouterModule]
})
export class DictionaryRoutingModule {}
