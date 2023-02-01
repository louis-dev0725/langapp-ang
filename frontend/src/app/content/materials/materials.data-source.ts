import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Content } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { Dictionary } from '@app/shared/helpers';
import { chunk } from 'lodash';
import { BehaviorSubject, firstValueFrom, Observable, Subscription } from 'rxjs';

export class MaterialsDataSource extends DataSource<Content[] | undefined> {
  public get length() {
    return this._cachedData.length;
  }

  public pageSize = 10;
  public itemsPerRow = 2;
  public totalLength = 0;

  private _realPageSize = this.pageSize * this.itemsPerRow;
  private _maxAccessedPage = 0;
  private _randomSeed = Math.random();

  private _cachedData = Array.from<Content[]>({ length: this.currentOffset + this.pageSize });
  private _fetchedPages = new Set<number>();
  private _pendingRequests: { page: number; subscription: Subscription }[] = [];
  private _maxPendingRequests = 3;
  private _fullScrollMode = false;
  private readonly _dataStream = new BehaviorSubject<(Content[] | undefined)[]>(this._cachedData);
  private readonly _subscription = new Subscription();
  private cacheKey = 'materialsDataSource';

  constructor(public formParams: Dictionary<string>, private api: ApiService, public currentOffset = 0) {
    super();
    this._loadState();
    this._fetchPage(1);
  }

  connect(collectionViewer: CollectionViewer): Observable<(Content[] | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
    this.limitPendingRequests(0);
  }

  limitPendingRequests(maxPendingRequests = this._maxPendingRequests) {
    if (this._pendingRequests.length >= maxPendingRequests) {
      let toCancel = this._pendingRequests.splice(0, this._pendingRequests.length - maxPendingRequests);
      for (let item of toCancel) {
        item.subscription.unsubscribe();
        this._fetchedPages.delete(item.page);
      }
    }
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize) + 1;
  }

  private async _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }

    this._fetchedPages.add(page);
    let queryParams = this.getQueryParams(page);
    const subscription = this.api.contentList(queryParams).subscribe((result) => {
      this._maxAccessedPage = Math.max(this._maxAccessedPage, page);

      if (this.totalLength != result._meta.totalCount / this.itemsPerRow) {
        this.totalLength = result._meta.totalCount / this.itemsPerRow;
        if (this._fullScrollMode) {
          this._cachedData.length = this.totalLength;
        }
      }
      if (!this._fullScrollMode) {
        this._cachedData.length = Math.min(Math.max(this._cachedData.length, (this._maxAccessedPage + 1) * this.pageSize), this.totalLength);
      }
      this._cachedData.splice((page - 1) * this.pageSize, this.pageSize, ...chunk(result.items, this.itemsPerRow));
      this._dataStream.next(this._cachedData);
      this._updateState();

      this._pendingRequests = this._pendingRequests.filter((r) => r.page != page);
    });

    this._pendingRequests.push({ page, subscription });
    this.limitPendingRequests();
  }

  getQueryParams(page: number) {
    let params = { ...this.formParams };
    if (params['filter[sort]']) {
      params['sort'] = params['filter[sort]'];
      if (params['sort'] === 'random') {
        params['randomSeed'] = `${this._randomSeed}`;
      }
      delete params['filter[sort]'];
    }
    params['filter[status]'] = '1';
    params['filter[deleted]'] = '0';

    params['page'] = String(page);
    params['per-page'] = String(this._realPageSize);

    return params;
  }

  _loadState() {
    if (window) {
      const globalState = window.history.state;
      const state = globalState[this.cacheKey];
      if (state && JSON.stringify(state.formParams) == JSON.stringify(this.formParams)) {
        this._cachedData = state._cachedData;
        this._fetchedPages = state._fetchedPages;
        this.totalLength = state.totalLength;
        this._dataStream.next(this._cachedData);
      }
    }
  }

  _updateState() {
    if (window) {
      let globalState = window.history.state || {};
      globalState[this.cacheKey] = this._generateState();
      window.history.replaceState(globalState, null, null);
    }
  }

  _generateState() {
    return {
      _cachedData: this._cachedData,
      _fetchedPages: this._fetchedPages,
      totalLength: this.totalLength,
      formParams: this.formParams,
    };
  }
}
