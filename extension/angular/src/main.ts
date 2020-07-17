import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (environment.production) {
    enableProdMode();
  }

  // provides the current Tab ID so you can send messages to the content page
  platformBrowserDynamic([]).bootstrapModule(AppModule).catch(error => console.error(error));
});
