import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '../../event.service';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss']
})
export class AdmUsersComponent implements OnInit {

  private usersSubscription: Subscription;

  columns = ['id', 'name', 'company', 'telephone', 'balance', 'comment', 'edit'];
  notFilterFields = ['Comment', 'Edit'];
  usersList: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  isEmptyTable = true;

  translatedKeys = {
    Name: 'Name',
    Company: 'Company',
    Phone: 'Phone',
    Balance: 'Balance',
    Email: 'Email',
    Comment: 'Comment',
    Edit:'Edit',

  };

  get fileldKeys(): any[] {
    const keys = Object.keys(this.translatedKeys);
    keys.unshift('id');
    return keys;
  }

  filter = {
    id: '',
    name: '',
    company:'',
    telephone: '',
    email:''
  };

  set rows(data: any[]) {
    this.isEmptyTable = (data) ? data.length === 0 : true;
    this.usersList = new MatTableDataSource(data);
    this.usersList.sort = this.sort;
    this.usersList.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator;
  @ViewChild(MatSort) sort;

  constructor(
    private api: ApiService,
    private eventService: EventService,
    private ref: ChangeDetectorRef,
    private translate: TranslateService) { }

  ngOnInit() {

    this.transatePage();

    this.sort.sortChange.subscribe((data) => {
      this.getUsers();
    });

    this.eventService.emitter.subscribe((event) => {
      if(event.type === 'language-change') {
        this.transatePage();
      }
    });
    this.getUsers();
  }

  isFilterField(item: string): boolean {
    return this.notFilterFields.indexOf(item) < 0;
  }

  getUsers() {
    let sort:any = {};
    if (this.sort.direction !== '') {
      sort[this.sort.active] = this.sort.direction;
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }

    this.usersSubscription = this.api.getAdminUsers(0, {}, sort).subscribe((res: any) => {
      this.rows = res.items;
    })
  }

  runFilter() {
    console.log('filter', this.filter);
    // this.getUsers();
  }

  transatePage() {
    this.translate.get(this.fileldKeys).subscribe((res: any) => {
      this.translatedKeys = res;
    });
  }
}
