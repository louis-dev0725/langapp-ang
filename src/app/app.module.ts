import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanactivateLogged } from './services/canactivate-logged';
import { CanactivateNologged } from './services/canactivate-nologged';
import { CustomPaginatorTranslator } from './services/custom-paginator-translator';
import { CanactivateAdmin } from './services/canactivate-admin';
import { SessionService } from './services/session.service';
import { CustomValidator } from '@app/services/custom-validator';
import { HttpInterceptorService } from '@app/http/http-interceptor';
import { ThemeModule } from '@app/theme/theme.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ContentPageComponent } from './content-page/content-page.component';
import { BreadCrumbsService } from '@app/services/bread-crumbs.service';
import { ConfirmDialogModule } from '@app/common/confirm-dialog/confirm-dialog.module';

export function createTranslateLoader(http: HttpClient) {
  // todo: [SHR]: change prefix for translation files
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, ContentPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ThemeModule,
    ConfirmDialogModule
  ],
  providers: [
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    CustomValidator,
    BreadCrumbsService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorTranslator },
    { provide: LOCALE_ID, useFactory: SessionService.getLocale() },

    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
