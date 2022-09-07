import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanactivateLogged } from '@app/guards/canactivate-logged';
import { TrainingComponent } from '@app/training/training.component';
import { IndexComponent } from './index/index.component';
import { WordInfoComponent } from '@app/training/word-info/word-info.component';
import { KanjiInfoComponent } from '@app/training/kanji-info/kanji-info.component';
import { FuriganaOneKanjiComponent } from '@app/training/furigana-one-kanji/furigana-one-kanji.component';
import { FuriganaWholeWordComponent } from '@app/training/furigana-whole-word/furigana-whole-word.component';
import { TypeFuriganaWholeWordComponent } from '@app/training/type-furigana-whole-word/type-furigana-whole-word.component';
import { TranslationWordComponent } from '@app/training/translation-word/translation-word.component';
import { WordTranslationComponent } from '@app/training/word-translation/word-translation.component';
import { WordAudioComponent } from '@app/training/word-audio/word-audio.component';
import { WordSentenceComponent } from '@app/training/word-sentence/word-sentence.component';
import { AudioWordComponent } from '@app/training/audio-word/audio-word.component';
import { EndTrainingComponent } from '@app/training/end-training/end-training.component';
import { TrainingGuard } from '@app/training/guards/training.guard';
import { WordSentenceVideoComponent } from '@app/training/word-sentence-video/word-sentence-video.component';

const trainingRoutes: Routes = [
  {
    path: '',
    component: TrainingComponent,
    canActivate: [CanactivateLogged],
    data: {
      breadcrumb: { label: 'Study new words', skip: true },
    },
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full',
      },
      {
        path: 'index',
        component: IndexComponent,
        data: {
          breadcrumb: { label: 'Start', skip: true },
        },
      },
      {
        path: 'word-info/:id',
        component: WordInfoComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Word Info', skip: true },
        },
      },
      {
        path: 'kanji-info/:id',
        component: KanjiInfoComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Kanji Info', skip: true },
        },
      },
      {
        path: 'furigana-for-one-kanji',
        component: FuriganaOneKanjiComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Furigana for one kanji', skip: true },
        },
      },
      {
        path: 'furigana-for-whole-word',
        component: FuriganaWholeWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Furigana for whole word', skip: true },
        },
      },
      {
        path: 'type-furigana-for-whole-word',
        component: TypeFuriganaWholeWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Type furigana for whole word', skip: true },
        },
      },
      {
        path: 'translation-for-word',
        component: TranslationWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Translation for word', skip: true },
        },
      },
      {
        path: 'word-for-translation',
        component: WordTranslationComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Word for translation', skip: true },
        },
      },
      {
        path: 'word-for-audio',
        component: WordAudioComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Word for audio', skip: true },
        },
      },
      {
        path: 'word-for-sentence',
        component: WordSentenceComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Word for sentence', skip: true },
        },
      },
      {
        path: 'word-for-sentence-video',
        component: WordSentenceVideoComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Word for sentence video', skip: true },
        },
      },
      {
        path: 'audio-for-word',
        component: AudioWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'Audio for word', skip: true },
        },
      },
      {
        path: 'end-of-training',
        component: EndTrainingComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: { label: 'End of training', skip: true },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trainingRoutes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
