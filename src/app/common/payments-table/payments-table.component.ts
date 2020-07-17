import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { ApiService } from '@app/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '@app/services/session.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss']
})
export class PaymentsTableComponent implements OnInit, OnDestroy {
  @Input() isPaginator = false;

  private _isShowComment;

  get isShowComment(): boolean {
    return this._isShowComment;
  }

  @Input() set isShowComment(val: boolean) {
    this._isShowComment = val;
    if (val) {
      this.columns.push('comment');
    } else {
      this.columns.pop();
    }
  }

  private _isShowId;

  get isShowId(): boolean {
    return this._isShowId;
  }

  @Input() set isShowId(val: boolean) {
    this._isShowId = val;
    if (val) {
      this.columns.unshift('id');
    } else {
      this.columns.shift();
    }
  }

  private _isShowPartnerEarn: boolean;

  get isShowPartnerEarn(): boolean {
    return this._isShowPartnerEarn;
  }

  set isShowPartnerEarn(val: boolean) {
    this._isShowPartnerEarn = val;
    if (val) {
      this.columns.pop();
      this.columns.push('partnerEarned');
    } else {
      this.columns.pop();
      this.columns.push('money');
    }
  }

  columns: string[] = ['addedDateTime', 'money'];

  @ViewChild(MatPaginator, { static: false }) paginator;
  @ViewChild(MatSort, { static: true }) sort;

  @Input() moneyTitle: any;

  @Input() set rows(data: any[]) {
    this.isEmptyTable = data ? data.length === 0 : true;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    if (this.isPaginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private _isLoaded = true;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  @Output() tableEvents: EventEmitter<any> = new EventEmitter<any>();

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  isEmptyTable = true;
  @Input()
  pageSize: any;

  constructor(private session: SessionService, private api: ApiService, private translate: TranslateService) {}

  ngOnInit() {
    this.sort.sortChange
    .pipe(untilDestroyed(this))
    .subscribe(data => {
      const sort: any = {};
      if (this.sort.direction !== '') {
        sort[this.sort.active] = this.sort.direction;
      }
      this.tableEvents.emit({ type: 'sort', data: sort });
    });
  }

  ngOnDestroy() {}

  onPage(event: PageEvent) {
    this.tableEvents.emit({ type: 'page', data: event });
  }
}
