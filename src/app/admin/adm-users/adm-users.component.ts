import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { MatPaginator, MatSort, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '@app/event.service';
import { Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss']
})
export class AdmUsersComponent implements OnInit {

  private usersSubscription: Subscription;
  private sendTimeout;

  columns = ['id', 'name', 'company', 'telephone', 'balance',  'balancePartner', 'comment', 'edit'];
  notFilterFields = ['Comment', 'Edit'];
  usersList: any = {};
  isEmptyTable = true;
  isFilterShown = false;

  translatedKeys = {
    Id: 'Id',
    Name: 'Name',
    Company: 'Company',
    Phone: 'Phone',
    Balance: 'Balance',
    BalancePartner: 'BalancePartner',
    Email: 'Email',
    Comment: 'Comment',
    Edit: 'Edit'
  };

  fieldKeys: any;

  filter: any = {
    id: '',
    name: '',
    company: '',
    telephone: '',
    email: '',
    isservicepaused: '',
  };

  set rows(data: any[]) {
    this.isEmptyTable = (data) ? data.length === 0 : true;
    this.usersList = data;
    this.usersList.sort = this.sort;
    this.usersList.paginator = this.paginator;
  }

  @ViewChild(MatPaginator, {static: true}) paginator;
  @ViewChild(MatSort, {static: true}) sort;
  isLoaded = false;

  constructor(
    private api: ApiService,
    private eventService: EventService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private session: SessionService,
    private translate: TranslateService) {
  }

  ngOnInit() {

    this.fieldKeys = Object.keys(this.translatedKeys);

    this.transatePage();

    this.sort.sortChange.subscribe((data) => {
      this.getUsers();
    });

    this.eventService.emitter.subscribe((event) => {
      if (event.type === 'language-change') {
        this.transatePage();
      }
    });
    this.getUsers();
  }

  isFilterField(item: string): boolean {
    return this.notFilterFields.indexOf(item) < 0;
  }

  getUsers(): void {
    this.isLoaded = false;
    this.rows = [];
    const sort: any = {};
    if (this.sort.direction !== '') {
      sort[this.sort.active] = this.sort.direction;
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    const toSendFilter: any = Object.assign({}, this.filter);

    const replaceKeys = {isservicepaused: 'isServicePaused'};

    Object.keys(toSendFilter).forEach((key) => {

      if (toSendFilter[key] === '') {
        delete toSendFilter[key];
      }

      if (replaceKeys[key] && toSendFilter[key]) {
        toSendFilter[replaceKeys[key]] = toSendFilter[key];
        delete toSendFilter[key]
      }

    });


    this.usersSubscription = this.api.getAdminUsers(this.paginator.pageIndex, toSendFilter, sort)
      .subscribe((res: any) => {
        if (!(res instanceof ApiError)) {
          this.rows = res.items;
          this.paginator.length = res._meta.totalCount;
          this.paginator.pageIndex = res._meta.currentPage - 1;
        }
        this.isLoaded = true;
      });
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
    this.translate.get(this.fieldKeys).subscribe((res: any) => {
      this.translatedKeys = Object.assign({id: 'ID'}, res);

    });
  }

  showEditUser(row: any) {
    this.session.userToEdit = row;
    this.router.navigate([`/admin/user/${row.id}`])
  }

  onPageChange(event: PageEvent) {
    this.getUsers();
  }

  clearFilter() {
    Object.keys(this.filter).map((item) => {
      this.filter[item] = '';
    });
    this.runFilter();
  }
}
