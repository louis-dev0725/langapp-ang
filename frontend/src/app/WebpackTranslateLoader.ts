import { TranslateLoader } from '@ngx-translate/core';
import { from } from 'rxjs';

/** @desc Loads translations files in `src/assets/i18n/${lang}.json` */
export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return from(import(`../assets/i18n/${lang}.json`));
  }
}