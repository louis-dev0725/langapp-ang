import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../services/api.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss']
})
export class PaymentsTableComponent implements OnInit {

  @Input() isPaginator = false;

  private _isShowComment;

  get isShowComment(): boolean {
    return  this._isShowComment;
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

  @ViewChild(MatPaginator) paginator;
  @ViewChild(MatSort) sort;

  @Input() moneyTitle: any;

  @Input() set rows(data: any[]) {
    this.isEmptyTable = (data) ? data.length === 0 : true;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    if (this.isPaginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  isEmptyTable = true;


  constructor(
    private api: ApiService,
    private translate: TranslateService) {
  }

  ngOnInit() {

  }

}
