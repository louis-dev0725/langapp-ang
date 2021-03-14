import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { TrainingRoutingModule } from '@app/training/training-routing.module';
import { NavigateActionCardComponent } from '@app/shared/navigate-action-card/navigate-action-card.component';

import { TrainingComponent } from './training.component';
import { CardsWordKanjiComponent } from './cards-word-kanji/cards-word-kanji.component';
import { CardsKanjiComponent } from './cards-kanji/cards-kanji.component';
import { CardsWordComponent } from './cards-word/cards-word.component';
import { WordTranslateComponent } from './word-translate/word-translate.component';
import { ModalMnemonicComponent } from './modal-mnemonic/modal-mnemonic.component';
import { CreateMnemonicModalComponent } from './create-mnemonic-modal/create-mnemonic-modal.component';
import { ComboStudyComponent } from './combo-study/combo-study.component';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    TrainingComponent,
    CardsWordKanjiComponent,
    CardsKanjiComponent,
    CardsWordComponent,
    WordTranslateComponent,
    NavigateActionCardComponent,
    ModalMnemonicComponent,
    CreateMnemonicModalComponent,
    ComboStudyComponent,
    IndexComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    TrainingRoutingModule,
    SharedModule
  ]
})
export class TrainingModule { }
