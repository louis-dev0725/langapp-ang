import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, MissingTranslationStrategy, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ApiService } from './services/api.service';
import {
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
import { LoginModule } from './login/login.module';
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
/*import { I18n, MISSING_TRANSLATION_STRATEGY } from "@ngx-translate/i18n-polyfill";
declare const require;*/

let translations;
export function createTranslateLoader(http: HttpClient) {
  // todo: [SHR]: change prefix for translation files
  translations = new TranslateHttpLoader(http, './assets/i18n/', '.json');
  return translations;
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaymentComponent,
    ContactComponent,
    SuccessComponent
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
    LoginModule,
    NgxCaptchaModule,
    FormsModule,
    PartnersModule,
    ReactiveFormsModule,
    UsersModule,

    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
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
    MatProgressBarModule
  ],
  providers: [
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    CustomValidator,
    {provide: MatPaginatorIntl, useClass: CustomPaginatorTranslator},
    {provide: LOCALE_ID, useFactory: SessionService.getLocale()},
    /*{provide: TRANSLATIONS, useValue: translations},
    {provide: TRANSLATIONS_FORMAT, useValue: 'json'},
    {provide: LOCALE_ID, useValue: "fr"},
    {provide: MISSING_TRANSLATION_STRATEGY, useValue: MissingTranslationStrategy.Ignore},
    I18n,*/
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
