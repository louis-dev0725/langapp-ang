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
  private sendTimeout;

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
    isServicePaused: 'Is service paused'
  };

  get fileldKeys(): any[] {
    return Object.keys(this.translatedKeys);
  }

  filter = {
    id: '',
    name: '',
    company:'',
    telephone: '',
    email:'',
    isservicepaused: '',
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
    let toSendFilter = Object.assign({}, this.filter);

    const replaceKeys = {isservicepaused: 'isServicePaused'};

    console.log('tosend', toSendFilter);

    Object.keys(toSendFilter).forEach((key) => {

      if(toSendFilter[key]=== '') {
        delete toSendFilter[key];
      }

      if (replaceKeys[key] && toSendFilter[key]) {
        toSendFilter[replaceKeys[key]] = toSendFilter[key];
        delete toSendFilter[key]
      }

    });


    this.usersSubscription = this.api.getAdminUsers(0, toSendFilter, sort).subscribe((res: any) => {
      this.rows = res.items;
    })
  }

  runFilter() {
    if (this.sendTimeout) {
      clearTimeout(this.sendTimeout);
    }
    this.sendTimeout = setTimeout(() => {
      this.getUsers();
    }, 300)
  }

  transatePage() {
    this.translate.get(this.fileldKeys).subscribe((res: any) => {
      this.translatedKeys = Object.assign({id: 'ID'}, res);

    });
  }
}
