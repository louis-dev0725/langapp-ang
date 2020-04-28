import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { EventsService } from '@app/services/events.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private eventsService: EventsService, private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dupReq = request;
    let loading = true;

    dupReq.headers.append('Accept-Language', localStorage.getItem('lang'));
    setTimeout(() => {
      if (loading) {
        this.eventsService.progressBarLoading.emit(true);
      }
    }, 200);
    return next.handle(dupReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            loading = false;
            this.eventsService.progressBarLoading.emit(false);
          }
        },
        (err: any) => {
          loading = false;
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401 && err.status !== 403 && err.status !== 422) {
              const config = new MatSnackBarConfig();
              config.duration = 3000;
              config.panelClass = ['snack-error'];
              this.snackBar.open(err.message, null, config);
            }
            loading = false;
            this.eventsService.progressBarLoading.emit(false);
          }
        }
      )
    );
  }
}
