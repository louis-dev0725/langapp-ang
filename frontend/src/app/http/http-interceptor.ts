import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EventsService } from '@app/services/events.service';
import { environment } from '../../environments/environment';
import { SessionService } from '@app/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private eventsService: EventsService, private session: SessionService) {}

  countRequestsWaiting = 0;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request;
    let loading = true;

    if (request.url.startsWith('/') || request.url.startsWith(window.location.origin) || request.url.startsWith(environment.apiUrl)) {
      newRequest = request.clone({
        setHeaders: {
          'Accept-Language': this.session.lang$.value,
          Authorization: 'Bearer ' + this.session.token$.value,
        },
      });
    }
    // Show progressbar if request takes more than 500 ms (but don't show for background check requests)
    if (request.url.indexOf('bg-check=1') === -1) {
      setTimeout(() => {
        if (loading) {
          this.eventsService.progressBarLoading.emit(true);
        }
      }, 500);
    }

    this.countRequestsWaiting++;

    return next.handle(newRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            loading = false;
            this.countRequestsWaiting--;
            if (this.countRequestsWaiting <= 0) {
              this.eventsService.progressBarLoading.emit(false);
            }
          }
        },
        (err: any) => {
          loading = false;
          this.countRequestsWaiting--;
          if (this.countRequestsWaiting <= 0) {
            this.eventsService.progressBarLoading.emit(false);
          }
        }
      )
    );
  }
}
