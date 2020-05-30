import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { DictionaryArray } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { TranslatingService } from '@app/services/translating.service';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { ListWordsComponent } from '@app/dictionary/list-words/list-words.component';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit, OnDestroy {
  daraSource: DictionaryArray;
  typeFilter = '';
  word = false;
  kanji = false;
  allSelect = false;
  indeterminate = false;

  @ViewChild(ListWordsComponent, {static: false})
  private listComponent: ListWordsComponent;

  constructor(private api: ApiService, private formBuilder: FormBuilder,
              private router: Router, private translatingService: TranslatingService, private snackBar: MatSnackBar,
              private session: SessionService) { }

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  @Input()
  set isLoadedData(val: boolean) {
    this._isLoadedData = val;
  }

  get isLoadedData(): boolean {
    return this._isLoadedData;
  }

  private _isLoaded = false;
  private _isLoadedData = false;

  ngOnInit() {
    const data = 'user_id=' + this.session.user.id;
    this.api.getUserDictionary(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoaded = true;
      this._isLoadedData = true;
    });
  }

  onFilter(typeFilter: string) {
    this._isLoadedData = false;
    this.typeFilter = typeFilter;

    let data = 'user_id=' + this.session.user.id;
    if (this.typeFilter === 'kanji') {
      if (!this.kanji) {
        this.word = false;
        this.kanji = true;
        data += '&type=' + this.typeFilter;
      } else {
        this.kanji = false;
      }
    } else {
      if (!this.word) {
        this.kanji = false;
        this.word = true;
        data += '&type=' + this.typeFilter;
      } else {
        this.word = false;
      }
    }

    this.api.getUserDictionary(data).pipe(untilDestroyed(this)).subscribe((res) => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoadedData = true;
    });
  }

  changePageTable(data) {
    this._isLoadedData = false;

    const href = 'user_id=' + this.session.user.id + '&type=' + this.typeFilter
      + this.daraSource._links.self.href.split('?')[1].split('page')[0]
      + '&page=' + (+(data.pageIndex) + 1) + '&per-page=' + data.pageSize;

    this.api.getUserDictionary(href).pipe(untilDestroyed(this)).subscribe((res) => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoadedData = true;
    });

    this.daraSource.items.forEach((elem) => {
      elem.checked = false;
    });
  }

  allSelectedToggle(event) {
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
        this.snackBar.open(this.translatingService.translates['confirm'].dictionaries.deleted, null, {duration: 3000});

        ids.forEach((id) => {
          const elem = this.daraSource.items.findIndex(item => item.id === id);
          this.daraSource.items.splice(elem, 1);
        });
        this.listComponent.ids = [];
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }
    });
  }

  deleteDictionary(event) {
    this._isLoadedData = false;

    this.api.deleteUserDictionary(event).pipe(untilDestroyed(this)).subscribe(res => {
      this._isLoadedData = true;

      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].dictionaty.deleted, null, {duration: 3000});
        const elem = this.daraSource.items.findIndex(item => item.id === event);
        this.daraSource.items.splice(elem, 1);

        this.listComponent.ids = [];
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }
    });
  }

  ngOnDestroy () {}
}
