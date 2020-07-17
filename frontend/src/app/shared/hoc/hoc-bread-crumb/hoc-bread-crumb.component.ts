import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbsService } from '@app/services/bread-crumbs.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-hoc-bread-crumb',
  templateUrl: './hoc-bread-crumb.component.html',
  styles: []
})
export class HocBreadCrumbComponent implements OnInit, OnDestroy {
  public crumbs = [];

  constructor(private breadCrumbs: BreadCrumbsService) {}

  ngOnInit() {
    this.crumbs = this.breadCrumbs.getCrumbs();
    this.breadCrumbs.breadcrumbs$.pipe(untilDestroyed(this)).subscribe((res: any) => {
      this.crumbs = res;
    });
  }
  ngOnDestroy() {}
}
