import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanactivateLogged } from '@app/guards/canactivate-logged';
import { TrainingComponent } from '@app/training/training.component';
import { CardsWordKanjiComponent } from '@app/training/cards-word-kanji/cards-word-kanji.component';
import { CardsKanjiComponent } from '@app/training/cards-kanji/cards-kanji.component';
import { CardsWordComponent } from '@app/training/cards-word/cards-word.component';
import { WordTranslateComponent } from '@app/training/word-translate/word-translate.component';


const trainingRoutes: Routes = [
  {
    path: '',
    component: TrainingComponent,
    canActivate: [CanactivateLogged],
    data: {
      breadcrumb: 'Training'
    },
    children: [
      {
        path: 'cards-word-kanji',
        component: CardsWordKanjiComponent,
        data: {
          breadcrumb: 'CardsWordKanji'
        }
      },
      {
        path: 'cards-word',
        component: CardsWordComponent,
        data: {
          breadcrumb: 'CardsWord'
        }
      },
      {
        path: 'cards-kanji',
        component: CardsKanjiComponent,
        data: {
          breadcrumb: 'CardsKanji'
        }
      },
      {
        path: 'word-translate',
        component: WordTranslateComponent,
        data: {
          breadcrumb: 'WordTranslate'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(trainingRoutes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule {}
