import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ApiService } from '@app/services/api.service';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clientsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  columnNames: string[] = ['id', 'name', 'partnerEarned'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isEmptyTable = true;
  isLoaded = false;

  constructor(public session: SessionService, private api: ApiService) {}

  ngOnInit() {
    this.api.getClientsList().subscribe((res: any) => {
      this.isLoaded = true;
      if (!(res instanceof ApiError)) {
        this.isEmptyTable = res ? res.length === 0 : true;
        this.clientsDataSource = new MatTableDataSource(res);
      }
      this.clientsDataSource.sort = this.sort;
    });
    this.clientsDataSource.sort = this.sort;
  }
}
