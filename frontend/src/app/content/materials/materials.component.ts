import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService, SimpleListItem } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { Observable } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { Category, CategoryArray, Content, ListResponse } from '@app/interfaces/common.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatingService } from '@app/services/translating.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { allParams, base64ToObject, filterEmptyFromObject, objectToBase64, toQueryParams } from '@app/shared/helpers';

@UntilDestroy()
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  loading$: Observable<boolean>;
  contentList$: Observable<ApiError | ListResponse<Content>>;

  levels$: Observable<SimpleListItem[]>;
  types$: Observable<SimpleListItem[]>;
  lengthVariants$: Observable<SimpleListItem[]>;
  categories$: Observable<CategoryArray>;
  categories: Category[];

  currentPage = 1;
  defaultPerPage = 50;
  currentPerPage = this.defaultPerPage;

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder, private translatingService: TranslatingService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

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
    });

    this.contentList$ = allParams(this.route).pipe(
      switchMap((params) => {
        this.currentPage = params['page'] !== undefined ? Number(params['page']) : 1;
        this.currentPerPage = params['per-page'] !== undefined ? Number(params['per-page']) : this.defaultPerPage;
        console.log('params', params);
        if (params['filter']) {
          let filter = base64ToObject(params['filter']);

          if (filter) {
            this.filterForm.patchValue(filter);
          }
        }
        return this.api.contentList(this.getQueryParamsForRequest());
      })
    );

    this.filterForm.valueChanges.pipe(untilDestroyed(this)).subscribe((e) => this.onFormUpdated(e));
  }

  checkError(fieldName: string) {
    return !this.filterForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.filterForm, fieldName);
  }

  getQueryParamsForUrl() {
    let params = {};
    if (this.currentPage != 1) {
      params['page'] = String(this.currentPage);
    }
    if (this.currentPerPage != this.defaultPerPage) {
      params['per-page'] = String(this.currentPerPage);
    }
    let filterValue = filterEmptyFromObject(this.filterForm.value);
    if (Object.keys(filterValue).length != 0) {
      params['filter'] = objectToBase64(filterValue);
    }

    return params;
  }

  getQueryParamsForRequest() {
    let params = toQueryParams(this.filterForm.value, 'filter');
    if (this.currentPage != 1) {
      params['page'] = String(this.currentPage);
    }
    if (this.currentPerPage != this.defaultPerPage) {
      params['per-page'] = String(this.currentPerPage);
    }
    params['filter[status]'] = '1';
    params['filter[deleted]'] = '0';

    return params;
  }

  updateUrl() {
    this.router.navigate([], { queryParams: this.getQueryParamsForUrl() });
  }

  onFormUpdated(newValues: any) {
    this.updateUrl();
  }

  changePageTable(data) {
    this.currentPerPage = data.rows;
    this.currentPage = Number(data.page) + 1;
    this.updateUrl();
  }

  deleteMaterial(event) {
    this.api
      .deleteMaterial(event)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].materials.deleted, null, { duration: 3000 });
          this.router.navigate([], { queryParamsHandling: 'merge' });
        } else {
        }
      });
  }

  ngOnDestroy() {}
}
