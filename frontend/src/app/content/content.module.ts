import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ContentComponent } from '@app/content/content.component';
import { MaterialsComponent } from '@app/content/materials/materials.component';
import { CreateMaterialsComponent } from '@app/content/create-materials/create-materials.component';
import { SharedModule } from '@app/shared/shared.module';
import { ListMaterialsComponent } from '@app/content/materials/materials-list-item/materials-list-item.component';
import { EditMaterialsComponent } from '@app/content/edit-materials/edit-materials.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { VideojsComponent } from './videojs/videojs.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { IconModule } from '@visurel/iconify-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SkeletonModule } from 'primeng/skeleton';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    data: {
      breadcrumb: 'Materials',
    },
    children: [
      {
        path: '',
        redirectTo: 'materials',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: CreateMaterialsComponent,
        data: {
          breadcrumb: 'Create material',
        },
      },
      {
        path: 'edit/:id',
        component: EditMaterialsComponent,
        data: {
          breadcrumb: 'Edit material',
        },
      },
      {
        path: 'view/:id',
        component: ContentViewComponent,
        data: {
          breadcrumb: 'View material',
        },
      },
      {
        path: 'materials',
        component: MaterialsComponent,
        data: {
          breadcrumb: '',
        },
      },
    ],
  },
];

@NgModule({
  declarations: [ContentComponent, MaterialsComponent, CreateMaterialsComponent, EditMaterialsComponent, ListMaterialsComponent, ContentViewComponent, VideojsComponent],
  imports: [RouterModule.forChild(routes), CommonModule, TranslateModule.forChild(), ReactiveFormsModule, SharedModule, DialogModule, RippleModule, OverlayPanelModule, InputSwitchModule, IconModule, MultiSelectModule, ScrollingModule, SkeletonModule],
})
export class ContentModule {}
