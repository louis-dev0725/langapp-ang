import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { HttpInterceptorService } from '@app/http/http-interceptor';
import localeRu from '@angular/common/locales/ru';

import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { NativeScriptAnimationsModule } from 'nativescript-angular/animations';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from '@src/app/app-routing.module.tns';
import { AppComponent } from '@src/app/app.component.tns';
import { ApiService } from '@app/services/api.service';
import { CanactivateAdmin } from '@app/guards/canactivate-admin';
import { CanactivateLogged } from '@app/guards/canactivate-logged';
import { CanactivateNologged } from '@app/guards/canactivate-nologged';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
registerLocaleData(localeRu);

@NgModule({
  declarations: [AppComponent],
  imports: [
    NativeScriptUISideDrawerModule,
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NativeScriptAnimationsModule
  ],
  providers: [
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
