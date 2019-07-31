import { BrowserModule } from '@angular/platform-browser';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  LOCALE_ID,
  MissingTranslationStrategy,
  NgModule,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT
} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ApiService } from './services/api.service';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule,
  MatMenuModule, MatPaginatorIntl, MatPaginatorModule,
  MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanactivateLogged } from './services/canactivate-logged';
import { CanactivateNologged } from './services/canactivate-nologged';
import { UsersModule } from './users/users.module';
import { PaymentComponent } from './payment/payment.component';
import { PartnersModule } from './partners/partners.module';
import { CustomPaginatorTranslator } from './services/custom-paginator-translator';
import { ContactComponent } from './contact/contact.component';
import { PaymentsTableModule } from './common/payments-table/payments-table.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CanactivateAdmin } from './services/canactivate-admin';
import { ExtendedModule } from '@angular/flex-layout';
import { SessionService } from './services/session.service';
import { CustomValidator } from '@app/services/custom-validator';
import { SuccessComponent } from './payment/success/success.component';
import { HttpInterceptorService } from "@app/http/http-interceptor";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatingService } from "@app/services/translating.service";
import { ConfirmDialogModule } from "@app/common/confirm-dialog/confirm-dialog.module";
import { ThemeModule } from "@app/theme/theme.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ContentPageComponent } from './content-page/content-page.component';

export function createTranslateLoader(http: HttpClient) {
  // todo: [SHR]: change prefix for translation files
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

//export function translatingServiceFactory(http: HttpClient, translatingService: TranslatingService) {
//  return () => translatingService.loadFiles();
//}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaymentComponent,
    ContactComponent,
    SuccessComponent,
    ContentPageComponent
  ],
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
    NgxCaptchaModule,
    FormsModule,
    ReactiveFormsModule,

    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    PaymentsTableModule,
    ExtendedModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    ConfirmDialogModule,
    ThemeModule
  ],
  providers: [
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    CustomValidator,
    {provide: MatPaginatorIntl, useClass: CustomPaginatorTranslator},
    {provide: LOCALE_ID, useFactory: SessionService.getLocale()},

    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    /*TranslatingService,
    {
      provide: APP_INITIALIZER,
      useFactory: translatingServiceFactory,
      deps: [HttpClient, TranslatingService],
      multi: true
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
