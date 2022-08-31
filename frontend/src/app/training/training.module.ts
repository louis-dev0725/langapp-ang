import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { TrainingRoutingModule } from '@app/training/training-routing.module';
import { NavigateActionCardComponent } from '@app/shared/navigate-action-card/navigate-action-card.component';

import { TrainingComponent } from './training.component';
import { ModalMnemonicComponent } from './modal-mnemonic/modal-mnemonic.component';
import { CreateMnemonicModalComponent } from './create-mnemonic-modal/create-mnemonic-modal.component';
import { IndexComponent } from './index/index.component';
import { WordInfoComponent } from '@app/training/word-info/word-info.component';
import { KnobModule } from 'primeng/knob';
import { IconModule } from '@visurel/iconify-angular';
import { KanjiInfoComponent } from '@app/training/kanji-info/kanji-info.component';
import { JoinPipe } from '@app/training/pipes/join/join.pipe';
import { FuriganaOneKanjiComponent } from '@app/training/furigana-one-kanji/furigana-one-kanji.component';
import { FuriganaWholeWordComponent } from '@app/training/furigana-whole-word/furigana-whole-word.component';
import { TypeFuriganaWholeWordComponent } from '@app/training/type-furigana-whole-word/type-furigana-whole-word.component';
import { TranslationWordComponent } from '@app/training/translation-word/translation-word.component';
import { WordTranslationComponent } from '@app/training/word-translation/word-translation.component';
import { WordAudioComponent } from '@app/training/word-audio/word-audio.component';
import { WordSentenceComponent } from '@app/training/word-sentence/word-sentence.component';
import { AudioWordComponent } from '@app/training/audio-word/audio-word.component';
import { EndTrainingComponent } from '@app/training/end-training/end-training.component';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { WordSentenceVideoComponent } from '@app/training/word-sentence-video/word-sentence-video.component';
import { DrillWordComponent } from './drill-word/drill-word.component';
import { DrillAnswerButtonsComponent } from './drill-answer-buttons/drill-answer-buttons.component';
import { AudioService } from '@app/services/audio.service';
import { TypeWordWithButtonsComponent } from './type-word-with-buttons/type-word-with-buttons.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [TrainingComponent, NavigateActionCardComponent, ModalMnemonicComponent, CreateMnemonicModalComponent, IndexComponent, WordInfoComponent, KanjiInfoComponent, JoinPipe, FuriganaOneKanjiComponent, FuriganaWholeWordComponent, TypeFuriganaWholeWordComponent, TranslationWordComponent, WordTranslationComponent, WordAudioComponent, WordSentenceComponent, WordSentenceVideoComponent, AudioWordComponent, EndTrainingComponent, DrillWordComponent, DrillAnswerButtonsComponent, TypeWordWithButtonsComponent],
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, TrainingRoutingModule, SharedModule, KnobModule, IconModule, DialogModule, RadioButtonModule, A11yModule],
  providers: [AudioService],
})
export class TrainingModule {}
