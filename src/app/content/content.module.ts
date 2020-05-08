import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from '@app/content/content.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialsComponent } from '@app/content/materials/materials.component';
import { CreateMaterialsComponent } from '@app/content/create-materials/create-materials.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { ListMaterialsComponent } from '@app/content/materials/list-materials/list-materials.component';
import { EditMaterialsComponent } from '@app/content/edit-materials/edit-materials.component';

const routes: Routes = [
   {
    path: '',
    component: ContentComponent,
    data: {
      breadcrumb: 'Materials'
    },
    children: [
      {
        path: '',
        redirectTo: 'materials',
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateMaterialsComponent,
        data: {
          breadcrumb: 'Create material'
        },
      },
      {
        path: 'edit/:id',
        component: EditMaterialsComponent,
        data: {
          breadcrumb: 'Edit material'
        },
      },
      {
        path: 'materials',
        component: MaterialsComponent,
        data: {
          breadcrumb: ''
        },
      },
    ]
   }
];

@NgModule({
  declarations: [ContentComponent, MaterialsComponent, CreateMaterialsComponent, EditMaterialsComponent, ListMaterialsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ContentModule {}
