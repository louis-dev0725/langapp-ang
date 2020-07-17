import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '@app/category/category.component';
import { TranslateModule } from '@ngx-translate/core';
import { CreateCategoryComponent } from '@app/category/create-category/create-category.component';
import { EditCategoryComponent } from '@app/category/edit-category/edit-category.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { ListCategoryComponent } from '@app/category/list-category/list-category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    data: {
      breadcrumb: 'Categories'
    },
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'create',
        component: CreateCategoryComponent,
        data: {
          breadcrumb: 'Create category'
        },
      },
      {
        path: 'edit/:id',
        component: EditCategoryComponent,
        data: {
          breadcrumb: 'Edit category'
        },
      },
      {
        path: 'categories',
        component: ListCategoryComponent,
        data: {
          breadcrumb: ''
        },
      },
    ]
  }
];

@NgModule({
  declarations: [CategoryComponent, CreateCategoryComponent, EditCategoryComponent, ListCategoryComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CategoryModule {}
