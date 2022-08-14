import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { ApiService } from '@app/services/api.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanactivateLogged } from '@app/guards/canactivate-logged';
import { CanactivateNologged } from '@app/guards/canactivate-nologged';
import { CustomPaginatorTranslator } from '@app/services/custom-paginator-translator';
import { CanactivateAdmin } from '@app/guards/canactivate-admin';
import { SessionService } from '@app/services/session.service';
import { CustomValidator } from '@app/services/custom-validator';
import { HttpInterceptorService } from '@app/http/http-interceptor';
import { ThemeModule } from '@app/theme/theme.module';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, PlatformLocation, registerLocaleData } from '@angular/common';
import { ConfirmDialogModule } from '@app/common/confirm-dialog/confirm-dialog.module';
import { ConfirmationService, MessageService } from 'primeng/api';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

import { StoreModule, MetaReducer } from '@ngrx/store';
import { reducers } from '@app/store/reducers';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { WebpackTranslateLoader } from './WebpackTranslateLoader';
import { CookieModule } from 'ngx-cookie';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      },
    }),
    StoreModule.forRoot(reducers),
    environment.development ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    ThemeModule,
    ConfirmDialogModule,
    CookieModule.forRoot(),
    IonicModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (pl: PlatformLocation) => pl.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    SessionService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ss: SessionService) => () => ss.checkInvitedByUrlParams(),
      deps: [SessionService],
      multi: true,
    },
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    CustomValidator,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorTranslator },
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
