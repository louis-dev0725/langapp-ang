import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../services/api.service';
import {ApiError} from '../../services/api-error';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clientsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  columnNames: string[] = ['id', 'name', 'partnerEarned'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {

    this.api.getClientsList().subscribe((res: any) => {
      if (!(res instanceof ApiError))
      this.clientsDataSource = new MatTableDataSource(res);
      this.clientsDataSource.sort = this.sort;
    });
    this.clientsDataSource.sort = this.sort;
  }

}
