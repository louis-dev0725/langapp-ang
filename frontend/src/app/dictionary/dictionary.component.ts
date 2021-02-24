import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ListResponse, User, UserDictionary } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { TranslatingService } from '@app/services/translating.service';
import { SessionService } from '@app/services/session.service';
import { allParams, Dictionary, toQueryParams } from '@app/shared/helpers';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  list: ListResponse<UserDictionary>;
  loading: boolean;
  wordTypes: Dictionary<string>;
  lastFilters: Dictionary<FilterMetadata> = {};
  currentPage = 1;
  defaultPerPage = 50;
  currentPerPage = this.defaultPerPage;

  constructor(private api: ApiService, private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translatingService: TranslatingService,
    private session: SessionService) { }

  ngOnInit() {
    this.loading = true;

    this.wordTypes = {
      1: 'Word',
      2: 'Kanji',
    };
    this.filterForm = this.formBuilder.group({

    });

    allParams(this.route).pipe(untilDestroyed(this)).subscribe(params => {
      this.currentPage = params['page'] !== undefined ? Number(params['page']) : 1;
      this.currentPerPage = params['per-page'] !== undefined ? Number(params['per-page']) : this.defaultPerPage;
      if (params['filter']) {
        this.filterForm.patchValue(params['filter']);
      }
      this.updateList();
    });

    this.filterForm.valueChanges.pipe(untilDestroyed(this)).subscribe((e) => this.onFormUpdated(e));
  }

  updateList() {
    this.loading = true;
    this.api.getUserDictionary(this.getQueryParams(true)).pipe(untilDestroyed(this)).subscribe(res => {
      this.list = res;
      this.loading = false;
    });
  }

  showReadings(readings: { type: string, value: string }[], type: string, title: string) {
    let result = readings.filter(r => r.type == type).map(r => r.value).join(', ');
    if (result.length > 0) {
      result = title + result;
    }
    return result;
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
    //this.updateUrl();
    this.updateList();
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
      params['expand'] = 'dictionaryWord';
    }
    for (let [field, filter] of Object.entries(this.lastFilters)) {
      if (filter.value) {
        let key = 'filter[' + field + ']';
        if (filter.matchMode == 'startsWith') {
          params[key + '[like]'] = filter.value + '%';
        }
        else if (filter.matchMode == 'contains') {
          params[key + '[like]'] = filter.value;
        }
        else {
          params[key] = filter.value;
        }
      }
    }
    console.log('params', params, 'this.lastFilters', this.lastFilters);
    return params;
  }

  lazyLoad(event: LazyLoadEvent) {
    console.log('lazy', event);
    this.lastFilters = event.filters;
    this.currentPerPage = event.rows ? event.rows : this.defaultPerPage;
    this.currentPage = event.rows ? Math.floor(event.first / event.rows) + 1 : 1;
    this.updateUrl();
  }

  /*allSelectedToggle(event) {
    if (event.checked) {
      this.listComponent.allSelectList(true);
      this.allSelect = true;

      this.indeterminateTrue(this.listComponent.ids);
    } else {
      this.listComponent.allSelectList(false);
      this.allSelect = false;

      this.indeterminateTrue(this.listComponent.ids);
    }
  }

  allSelectedClick() {
    this.listComponent.allSelectList(true);
    this.allSelect = true;
  }

  indeterminateTrue(data) {
    if (data.length === 0) {
      this.allSelect = false;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
      if (data.length === this.daraSource.items.length) {
        this.indeterminate = false;
        this.allSelect = true;
      }
    }
  }

  onDeleteSelected() {
    this._isLoadedData = false;

    const ids = this.listComponent.ids;
    this.api.deleteUserDictionaries(ids).pipe(untilDestroyed(this)).subscribe(res => {
      this._isLoadedData = true;

      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].dictionaries.deleted, null, { duration: 3000 });

        ids.forEach((id) => {
          const elem = this.daraSource.items.findIndex(item => item.id === id);
          this.daraSource.items.splice(elem, 1);
        });
        this.listComponent.ids = [];
      } else {
        this.snackBar.open(String(res.error), null, { duration: 3000 });
      }
    });
  }

  deleteDictionary(event) {
    this._isLoadedData = false;

    this.api.deleteUserDictionary(event).pipe(untilDestroyed(this)).subscribe(res => {
      this._isLoadedData = true;

      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].dictionaty.deleted, null, { duration: 3000 });
        const elem = this.daraSource.items.findIndex(item => item.id === event);
        this.daraSource.items.splice(elem, 1);

        this.listComponent.ids = [];
      } else {
        this.snackBar.open(String(res.error), null, { duration: 3000 });
      }
    });
  }*/

  ngOnDestroy() { }
}
