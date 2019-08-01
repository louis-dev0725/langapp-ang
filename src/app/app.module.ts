import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { CustomPaginatorTranslator } from './services/custom-paginator-translator';
import { PaymentsTableModule } from './common/payments-table/payments-table.module';
import { CanactivateAdmin } from './services/canactivate-admin';
import { ExtendedModule } from '@angular/flex-layout';
import { SessionService } from './services/session.service';
import { CustomValidator } from '@app/services/custom-validator';
import { HttpInterceptorService } from "@app/http/http-interceptor";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmDialogModule } from "@app/common/confirm-dialog/confirm-dialog.module";
import { ThemeModule } from "@app/theme/theme.module";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ContentPageComponent } from './content-page/content-page.component';
import { BreadCrumbsService } from "@app/services/bread-crumbs.service";

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
    BreadCrumbsService,
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
