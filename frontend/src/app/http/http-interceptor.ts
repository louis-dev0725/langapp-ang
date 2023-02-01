import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { filter, finalize, Observable } from 'rxjs';
import { EventsService } from '@app/services/events.service';
import { environment } from '../../environments/environment';
import { SessionService } from '@app/services/session.service';
import { Router, Event as REvent, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  scrollToPosition: [number, number];
  scrollToTime: number;

  constructor(private eventsService: EventsService, private session: SessionService, private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.pipe(filter((event: REvent): event is Scroll => event instanceof Scroll)).subscribe((e) => {
      if (e.position) {
        this.scrollToPosition = e.position;
        this.scrollToTime = Date.now();
      }
    });
  }

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

      this.countRequestsWaiting++;

      return next.handle(newRequest).pipe(
        finalize(() => {
          loading = false;
          this.countRequestsWaiting--;
          // console.log('this.countRequestsWaiting', this.countRequestsWaiting);
          if (this.countRequestsWaiting <= 0) {
            this.eventsService.progressBarLoading.emit(false);
            this.onFinishedLoading();
          }
        })
      );
    } else {
      return next.handle(newRequest);
    }
  }

  onFinishedLoading() {
    if (this.scrollToPosition && Date.now() - this.scrollToTime < 3000) {
      let scrollToPosition = this.scrollToPosition;
      this.scrollToPosition = null;
      setTimeout(() => {
        this.viewportScroller.scrollToPosition(scrollToPosition);
      });
    }
  }
}
