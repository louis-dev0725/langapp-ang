import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clientsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  columnNames: string[] = ['id', 'name', 'partnerEarned'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {

    this.api.getClientsList().subscribe((res) => {
      this.clientsDataSource
    })
    this.clientsDataSource.paginator = this.paginator;
    this.clientsDataSource.sort = this.sort;
  }

}
