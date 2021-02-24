import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { DictionaryRoutingModule } from '@app/dictionary/dictionary-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { DictionaryComponent } from '@app/dictionary/dictionary.component';


@NgModule({
  declarations: [DictionaryComponent],
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, DictionaryRoutingModule,
    SharedModule]
})
export class DictionaryModule { }
