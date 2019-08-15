import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbsService implements OnDestroy {
  public breadcrumbs$: any = new BehaviorSubject([]);
  private breadcrumbs = [];
  private sub;
  private url;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  public initBreadCrumbs() {
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(e => e instanceof NavigationEnd),
        map(() => {
          const snapshot = this.router.routerState.snapshot;
          this.url = snapshot.url;
          this.breadcrumbs = [];
          let route = this.activatedRoute.firstChild;
          let child = route;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              if (child.data['value'] && child.data['value']['breadcrumb']) {
                this.breadcrumbs.push(this._mapCrumbs(child));
              }
              route = child;
            } else {
              child = null;
            }
          }
          return route;
        })
      )
      .subscribe((event: any) => {
        this.breadcrumbs = [...this.addUrls(this.breadcrumbs, this.url)];
        this.breadcrumbs$.next(this.breadcrumbs);
      });
  }

  public ngOnDestroy() { }

  public getCrumbs() {
    return this.breadcrumbs;
  }

  private addUrls(arr, url) {
    const _url = url.split('/').filter(el => el.length);
    return arr.map((el, i) => {
      let j = 0;
      let link = '';

      while (j <= i) {
        link = link + '/' + _url[j];
        j++;
        if (j > 20) {
          break;
        }
      }
      el['url'] = `${link}`;
      return el;
    });
  }

  private _mapCrumbs(el) {
    const name = el.data['value']['breadcrumb'];
    return {
      label: name.charAt(0).toUpperCase() + name.slice(1)
    };
  }
}
