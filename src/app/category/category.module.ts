import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from '@app/category/category.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ]
})
export class CategoryModule {}
