import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('rr');
    if (myParam) {
      localStorage.setItem('invitedByUserId', myParam);
      document.cookie = 'invitedByUserId=' + myParam;
    }
  })
  .catch(err => console.error(err));
