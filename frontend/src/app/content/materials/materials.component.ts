import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService, SimpleListItem } from '@app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { map, Observable } from 'rxjs';
import { Category, CategoryArray, Content } from '@app/interfaces/common.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatingService } from '@app/services/translating.service';
import { allParams, base64ToObject, filterEmptyFromObject, objectToBase64, toQueryParams } from '@app/shared/helpers';
import { MaterialSortOptions } from './common/constant';
import { deepEqual } from './common/helper';
import { MaterialsDataSource } from './materials.data-source';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit, OnDestroy {
  filterForm: UntypedFormGroup;
  loading$: Observable<boolean>;
  dataSource$: Observable<MaterialsDataSource>;
  dataSource: MaterialsDataSource;

  levels$: Observable<SimpleListItem[]>;
  types$: Observable<SimpleListItem[]>;
  lengthVariants$: Observable<SimpleListItem[]>;
  categories$: Observable<CategoryArray>;
  categories: Category[];
  sortOptions: SimpleListItem[] = MaterialSortOptions;

  currentOffset = 0;
  itemSize = 174;
  isInitialOffset = true;
  defaultPerPage = 20;
  currentPerPage = this.defaultPerPage;

  @ViewChild(CdkVirtualScrollViewport)
  cdkScroll: CdkVirtualScrollViewport;

  get sortValue(): string {
    return this.filterForm.get('sort').value;
  }

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private translatingService: TranslatingService, private route: ActivatedRoute, private router: Router, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.levels$ = this.api.getContentLevels();
    this.types$ = this.api.getContentTypes();
    this.lengthVariants$ = this.api.getContentLengthVariants();
    this.categories$ = this.api.getAllCategories({ 'per-page': '100' });

    this.categories$.subscribe((c) => {
      this.categories = c.items;
    });

    this.filterForm = this.formBuilder.group({
      keywords: [''],
      level: [''],
      type: [''],
      length: [''],
      categoryId: [''],
      sort: ['random'],
    });
    this.setFavoriteCategories();

    let previousFilter = null;
    this.dataSource$ = allParams(this.route).pipe(
      map((params) => {
        this.currentOffset = params['offset'] !== undefined ? Number(params['offset']) : 0;
        this.currentPerPage = params['per-page'] !== undefined ? Number(params['per-page']) : this.defaultPerPage;
        if (params['filter']) {
          let filter: any = base64ToObject(params['filter']);
          if (filter?.categoryId?.length && filter?.categoryId[0] === -1) {
            filter = {
              ...filter,
              categoryId: [],
            };
          }
          // Do not update form if nothing will change
          const isSameValue = deepEqual({ ...this.filterForm.value, ...filter }, this.filterForm.value);
          if (filter && !isSameValue) {
            this.filterForm.patchValue(filter);
          }
          // Do not update list if filters not changed
          if (this.dataSource && previousFilter == params['filter']) {
            return this.dataSource;
          }
          previousFilter = params['filter'];
        }

        let formParams = toQueryParams(this.filterForm.value, 'filter');
        this.dataSource = new MaterialsDataSource(formParams, this.api, this.currentOffset);
        return this.dataSource;
      })
    );

    this.filterForm.valueChanges.pipe(untilDestroyed(this)).subscribe((e) => this.onFormUpdated(e));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateItemSize();
  }

  updateItemSize() {
    let cards = this.cdkScroll.elementRef.nativeElement?.querySelectorAll('.card');
    if (cards && cards[0] && cards[2]) {
      this.itemSize = cards[2].getBoundingClientRect().y - cards[0].getBoundingClientRect().y;
    } else {
      setTimeout(() => {
        this.updateItemSize();
      }, 1000);
    }
  }

  checkError(fieldName: string) {
    return !this.filterForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.filterForm, fieldName);
  }

  getQueryParamsForUrl() {
    let params = {};
    if (this.currentPerPage != this.defaultPerPage) {
      params['per-page'] = String(this.currentPerPage);
    }
    let filterValue = filterEmptyFromObject(this.filterForm.value);
    const formVal = this.filterForm.value;
    if (typeof formVal?.categoryId === 'object' && formVal?.categoryId?.length === 0) {
      // Set categoryId as [-1] (indication for empty array) to add condition to remove all the Favorite categoryIds
      filterValue.categoryId = [-1];
    }
    if (Object.keys(filterValue).length != 0) {
      params['filter'] = objectToBase64(filterValue);
    }
    if (this.currentOffset != 0) {
      params['offset'] = this.currentOffset;
    }

    return params;
  }

  updateUrl() {
    this.router.navigate([], { queryParams: this.getQueryParamsForUrl(), replaceUrl: true });
  }

  offsetChanged(newOffset: number) {
    if (this.isInitialOffset) {
      this.isInitialOffset = false;
      this.updateItemSize();
      setTimeout(() => {
        let scrollPosition = this.viewportScroller.getScrollPosition();
        if (this.cdkScroll && scrollPosition[1] == 0 && newOffset == 0 && this.currentOffset != 0) {
          let viewportOffset = this.cdkScroll.measureViewportOffset();
          this.cdkScroll.scrollToOffset(Math.ceil(viewportOffset + this.currentOffset * this.itemSize));
        }
      });
    } else {
      this.currentOffset = newOffset;
      if (window) {
        // Avoid triggering Angular route update
        let newUrl = window.location.href
          .replace(/\?offset=\d+/, '?')
          .replace(/&offset=\d+/, '')
          .replace(/\?$/, '');
        newUrl += newUrl.includes('?') ? '&' : '?';
        newUrl += this.currentOffset > 0 ? 'offset=' + this.currentOffset : '';
        window.history.replaceState(window.history.state, null, newUrl);
      }
    }
  }

  onFormUpdated(newValues: any) {
    this.updateUrl();
  }

  setFavoriteCategories() {
    const favoriteCategoryIds = this.getFavoriteCategories();
    if (favoriteCategoryIds?.length) {
      this.filterForm.get('categoryId').setValue(favoriteCategoryIds);
    }
  }

  getFavoriteCategories() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.favoriteCategoryId || [];
  }

  getSortLabel(val: string) {
    return this.sortOptions.find((x) => x.value === val)?.title || '';
  }

  trackById(index: number, item: Content[]) {
    return item?.[0]?.id || -1 * index;
  }

  ngOnDestroy() {}
}
