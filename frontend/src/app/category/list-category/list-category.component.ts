import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoryArray } from '@app/interfaces/common.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { TranslatingService } from '@app/services/translating.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiError } from '@app/services/api-error';

@UntilDestroy()
@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
})
export class ListCategoryComponent implements OnInit, OnDestroy {
  categories: CategoryArray;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  displayedColumns: string[] = ['title', 'parent_category', 'button_edit', 'button_delete'];

  constructor(private api: ApiService, private router: Router, private translatingService: TranslatingService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.api
      .getAllCategories()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.categories = res;
        } else {
        }

        this._isLoaded = true;
      });
  }

  handlePage(event) {
    this._isLoaded = false;
    let href = this.categories._links.self.href.split('?')[1].split('page')[0];
    href = href + 'page=' + (+event.pageIndex + 1) + '&per-page=' + event.pageSize;

    this.api
      .getAllCategories(href)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.categories = res;
        this._isLoaded = true;
      });
  }

  deleteCategory(event) {
    this._isLoaded = false;

    this.api
      .deleteCategory(event)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].categories.deleted, null, { duration: 3000 });
          const elem = this.categories.items.findIndex((item) => item.id === event);
          this.categories.items.splice(elem, 1);
        } else {
        }

        this._isLoaded = true;
      });
  }

  ngOnDestroy(): void {}
}
