import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EventsService } from '@app/services/events.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private eventsService: EventsService, private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request;
    let loading = true;

    if (request.url.startsWith('/') || request.url.startsWith(window.location.origin)) {
      newRequest = request.clone({
        setHeaders: {
          'Accept-Language': localStorage.getItem('lang'),
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
    }
    setTimeout(() => {
      if (loading) {
        this.eventsService.progressBarLoading.emit(true);
      }
    }, 200);
    return next.handle(newRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            loading = false;
            this.eventsService.progressBarLoading.emit(false);
          }
        },
        (err: any) => {
          loading = false;
          this.eventsService.progressBarLoading.emit(false);
        }
      )
    );
  }
}
