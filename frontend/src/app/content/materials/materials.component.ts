import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService, SimpleListItem } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { combineLatest, Observable } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { Content, ContentsArray, ListResponse } from '@app/interfaces/common.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatingService } from '@app/services/translating.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators';
import { allParams, Dictionary, queryParamsToObject, toQueryParams, toQueryString } from '@app/shared/helpers';
import * as equal from 'fast-deep-equal';
import { HttpParams } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  loading$: Observable<boolean>;
  contentList$: Observable<ApiError | ListResponse<Content>>;

  levels$: Observable<SimpleListItem[]>;
  types$: Observable<SimpleListItem[]>;
  lengthVariants$: Observable<SimpleListItem[]>;

  currentPage = 1;
  defaultPerPage = 50;
  currentPerPage = this.defaultPerPage;

  constructor(private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private translatingService: TranslatingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.levels$ = this.api.getContentLevels();
    this.types$ = this.api.getContentTypes();
    this.lengthVariants$ = this.api.getContentLengthVariants();

    this.filterForm = this.formBuilder.group({
      keywords: [''],
      level: [''],
      type: [''],
      length: [''],
    });

    this.contentList$ = allParams(this.route).pipe(switchMap(params => {
      this.currentPage = params['page'] !== undefined ? Number(params['page']) : 1;
      this.currentPerPage = params['per-page'] !== undefined ? Number(params['per-page']) : this.defaultPerPage;
      if (params['filter']) {
        this.filterForm.patchValue(params['filter']);
      }
      return this.api.contentList(this.getQueryParams(true));
    }));

    this.filterForm.valueChanges.pipe(untilDestroyed(this)).subscribe((e) => this.onFormUpdated(e));
  }

  checkError(fieldName: string) {
    return !this.filterForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.filterForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];

    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  getQueryParams(forRequest = false) {
    let params = toQueryParams(this.filterForm.value, 'filter');
    if (forRequest || this.currentPage != 1) {
      params['page'] = String(this.currentPage);
    }
    if (forRequest || this.currentPerPage != this.defaultPerPage) {
      params['per-page'] = String(this.currentPerPage);
    }
    if (forRequest) {
      params['filter[status]'] = '1';
      params['filter[deleted]'] = '0';
    }

    return params;
  }

  updateUrl() {
    this.router.navigate([], { queryParams: this.getQueryParams() });
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
    this.api.deleteMaterial(event).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].materials.deleted, null, { duration: 3000 });
        this.router.navigate([], { queryParamsHandling: "merge" });
      } else {
        console.log(res.error);
      }
    });
  }

  ngOnDestroy() { }
}
