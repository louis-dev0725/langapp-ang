import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '@app/services/api.service';
import {ApiError} from '@app/services/api-error';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clientsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  columnNames: string[] = ['id', 'name', 'partnerEarned'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  isEmptyTable = true;
  isLoaded = true;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    this.api.getClientsList().subscribe((res: any[]) => {
      this.isEmptyTable = (res) ? res.length === 0 : true;
      this.clientsDataSource = new MatTableDataSource(res)
    });
    this.api.getClientsList().subscribe((res: any) => {
      this.isLoaded = true;
      if (!(res instanceof ApiError)) {
        this.clientsDataSource = new MatTableDataSource(res);
      }
      this.clientsDataSource.sort = this.sort;
    });
    this.clientsDataSource.sort = this.sort;
  }

}

