import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable({
  providedIn: 'root'
})

export class HttpInterceptorService implements HttpInterceptor {
  private baseUrl: string = 'http://service-template.lb7.ru/api';

  constructor(
    private snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let dupReq = request;
    // todo: only for testing
    if (request.url.indexOf('assets') == -1) {
      const subUrl = request.url.substring(request.url.indexOf('api') + 3);
      dupReq = request.clone({url: this.baseUrl + subUrl});
    }
    return next.handle(dupReq).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        console.log(event);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401 && err.status !== 422) {
          let config = new MatSnackBarConfig();
          config.panelClass = ['snack-error'];
          config.duration = 3000;
          this.snackBar.open(err.message, null, config);
        }
      }
    }));
  }
}
