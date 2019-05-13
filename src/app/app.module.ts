import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {ApiService} from './services/api.service';
import {
  MatButtonModule, MatInputModule,
  MatMenuModule, MatPaginatorIntl, MatPaginatorModule,
  MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CanactivateLogged} from './services/canactivate-logged';
import {CanactivateNologged} from './services/canactivate-nologged';
import {LoginModule} from './login/login.module';
import {UsersModule} from './users/users.module';
import {PaymentComponent} from './payment/payment.component';
import {PartnersModule} from './partners/partners.module';
import {CustomPaginatorTranslator} from './services/custom-paginator-translator';
import { ContactComponent } from './contact/contact.component';
import {PaymentsTableModule} from './common/payments-table/payments-table.module';
import {NgxCaptchaModule} from 'ngx-captcha';
import {CanactivateAdmin} from './services/canactivate-admin';
import {ExtendedModule} from '@angular/flex-layout';

export function createTranslateLoader(http: HttpClient) {
  // todo: [SHR]: change prefix for translation files
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaymentComponent,
    ContactComponent
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
    ExtendedModule
  ],
  providers: [
    ApiService,
    CanactivateAdmin,
    CanactivateLogged,
    CanactivateNologged,
    {provide: MatPaginatorIntl, useClass: CustomPaginatorTranslator}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
