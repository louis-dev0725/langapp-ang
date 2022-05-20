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
import { EndingGuard } from '@app/training/guards/ending.guard';
import { WordSentenceVideoComponent } from '@app/training/word-sentence-video/word-sentence-video.component';
import { WordInfoGuard } from '@app/training/guards/word-info.guard';
import { KanjiInfoGuard } from '@app/training/guards/kanji-info.guard';

const trainingRoutes: Routes = [
  {
    path: '',
    component: TrainingComponent,
    canActivate: [CanactivateLogged],
    data: {
      breadcrumb: 'Study new words',
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
          breadcrumb: 'Start',
        },
      },
      {
        path: 'word-info/:id',
        component: WordInfoComponent,
        canActivate: [WordInfoGuard],
        data: {
          breadcrumb: 'Word Info',
        },
      },
      {
        path: 'kanji-info/:id',
        component: KanjiInfoComponent,
        canActivate: [KanjiInfoGuard],
        data: {
          breadcrumb: 'Kanji Info',
        },
      },
      {
        path: 'furigana-for-one-kanji',
        component: FuriganaOneKanjiComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Furigana for one kanji',
        },
      },
      {
        path: 'furigana-for-whole-word',
        component: FuriganaWholeWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Furigana for whole word',
        },
      },
      {
        path: 'type-furigana-for-whole-word',
        component: TypeFuriganaWholeWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Type furigana for whole word',
        },
      },
      {
        path: 'translation-for-word',
        component: TranslationWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Translation for word',
        },
      },
      {
        path: 'word-for-translation',
        component: WordTranslationComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Word for translation',
        },
      },
      {
        path: 'word-for-audio',
        component: WordAudioComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Word for audio',
        },
      },
      {
        path: 'word-for-sentence',
        component: WordSentenceComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Word for sentence',
        },
      },
      {
        path: 'word-for-sentence-video',
        component: WordSentenceVideoComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Word for sentence video',
        },
      },
      {
        path: 'audio-for-word',
        component: AudioWordComponent,
        canActivate: [TrainingGuard],
        data: {
          breadcrumb: 'Audio for word',
        },
      },
      {
        path: 'end-of-training',
        component: EndTrainingComponent,
        canActivate: [EndingGuard],
        data: {
          breadcrumb: 'End of training',
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
