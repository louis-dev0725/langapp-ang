import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionaryComponent } from '@app/dictionary/dictionary.component';

const dictionaryRoutes: Routes = [
  {
    path: '',
    component: DictionaryComponent,
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
