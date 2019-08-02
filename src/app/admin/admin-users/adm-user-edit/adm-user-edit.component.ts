import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, PageEvent } from '@angular/material';
import { EventService } from '@app/event.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adm-user-edit',
  templateUrl: './adm-user-edit.component.html',
  styleUrls: ['./adm-user-edit.component.scss']
})
export class AdmUserEditComponent implements OnInit, OnDestroy {
  public userId;
  public transactionList: any = [];
  public columns = ['id', 'money', 'comment', 'addedDateTime', 'edit'];
  public transactionPartnerList: any = [];
  public languages = [
    {
      value: 'ru-RU',
      label: 'Русский'
    },
    {
      value: 'en-Us',
      label: 'English'
    }
  ];
  public isLoadingTrans = false;
  public isLoadingTransPartner = false;

  private _errors = [];
  private globalEventSubscription: Subscription;

  isChangePassword = false;
  userProfile: FormGroup;
  user: User;
  timeZones: any[] = [];

  messages: any = {
    'confirm.user-open.title': '',
    'confirm.user-open.msg': ''
  };
  // @ViewChild(MatSort, {static: true}) sort;
  @ViewChild('sortTrans', { static: true }) sortTrans: MatSort;
  @ViewChild('sortTransPartn', { static: true }) sortTransPartn: MatSort;

  @ViewChild('paginatorTrans', { static: true }) paginatorTrans;
  @ViewChild('paginatorPartnerTrans', { static: true }) paginatorPartnerTrans;

  get selectedTimeZone(): any {
    if (this.user) {
      return this.user.timezone;
    }
    return '';
  }

  get errors() {
    return this._errors;
  }

  constructor(
    public session: SessionService,
    private api: ApiService,
    private confirmDialog: MatDialog,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.getUser(this.userId);

    this.api.getTimeZones().subscribe((res: any) => {
      this.timeZones = res;
    });

    this.sortTrans.sortChange.subscribe(sort => {
      this.getTrans(this.userId);
    });
    this.sortTransPartn.sortChange.subscribe(sort => {
      this.getPartnerTrans(this.userId);
    });

    this.callTranslate();

    this.globalEventSubscription = this.eventService.emitter.subscribe(event => {
      if (event.type === 'language-change') {
        this.callTranslate();
      }
    });
    this.userProfile = this.formBuilder.group({
      id: [''],
      name: ['', { validators: [Validators.required], updateOn: 'change' }],
      company: [''],
      site: [''],
      telephone: [''],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
      isServicePaused: [''],
      balance: [''],
      balancePartner: [''],
      wmr: [''],
      registerIp: [''],
      lastLoginIp: [''],
      timezone: [''],
      language: [''],
      isPartner: [''],
      invitedByUserId: [''],
      enablePartnerPayments: [''],
      comment: ['']
    });
    this.getTrans(this.userId);
    this.getPartnerTrans(this.userId);
  }

  public getTrans(userId, page?) {
    const _sort: any = {};
    if (this.sortTrans.direction !== '') {
      _sort[this.sortTrans.active] = this.sortTrans.direction;
    }
    this.isLoadingTrans = true;
    this.getTransactions(userId, 0, _sort, page).subscribe(
      res => {
        this.transactionList = res.items;
        this.transactionList.sort = this.sortTrans;
        this.transactionList.paginator = this.paginatorTrans;
        this.paginatorTrans.length = res._meta.totalCount;
        this.paginatorTrans.pageIndex = res._meta.currentPage - 1;
        this.isLoadingTrans = false;
      },
      err => {
        this.isLoadingTrans = false;
      }
    );
  }

  public getPartnerTrans(userId, page?) {
    const _sort: any = {};
    if (this.sortTransPartn.direction !== '') {
      _sort[this.sortTransPartn.active] = this.sortTransPartn.direction;
    }
    this.isLoadingTransPartner = true;
    this.getTransactions(userId, 1, _sort, page).subscribe(
      res => {
        this.transactionPartnerList = res.items;
        this.transactionList.sort = this.sortTransPartn;
        this.transactionList.paginator = this.paginatorPartnerTrans;
        this.paginatorPartnerTrans.length = res._meta.totalCount;
        this.paginatorPartnerTrans.pageIndex = res._meta.currentPage - 1;
        this.isLoadingTransPartner = false;
      },
      err => {
        this.isLoadingTransPartner = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.globalEventSubscription) {
      this.globalEventSubscription.unsubscribe();
    }
  }

  showEditTransaction(row: any) {
    this.session.transaction = row;
    this.router.navigate([`/admin/transactions/${row.id}`]);
  }

  public getTransactions(id: number, partner?, sort?, page?) {
    return this.api.getTransactionByUser(id, partner, sort, page);
  }

  public onPageChange(event: PageEvent, partner?) {
    partner ? this.getPartnerTrans(this.userId) : this.getTrans(this.userId);
  }

  public getUser(id: number) {
    return this.api.getUserById(id).subscribe(
      (res: any) => {
        this.user = res;
        this.session.userToEdit = res;
        this.updateForm(res);
      },
      err => {}
    );
  }

  public updateForm(res) {
    this.userProfile.patchValue({
      id: res.id,
      ...res
    });
  }

  get isServicePaused(): boolean {
    if (!this.user) {
      return false;
    }
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  checkError(fieldName: string) {
    return !this.userProfile.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.userProfile.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.userProfile.addControl(
        'password',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      );
      this.userProfile.addControl(
        'passrepeat',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      );
      this.userProfile.setValidators([CustomValidator.confirmPasswordCheck]);
      this.userProfile.updateValueAndValidity();
    } else {
      this.userProfile.clearValidators();
      this.userProfile.updateValueAndValidity();
      this.userProfile.removeControl('password');
      this.userProfile.removeControl('passrepeat');
    }
  }

  onProfileSave() {
    const data = {
      ...this.userProfile.value,
      enablePartnerPayments: this.userProfile.value.enablePartnerPayments ? 1 : 0,
      isPartner: this.userProfile.value.isPartner ? 1 : 0
    };
    this.api.updateUser(data).subscribe(res => {
      if (res instanceof ApiError) {
        this._errors = res.error;
      } else {
        this.snackBar.open(this.customValidator.messagesMap['snackbar.user-edit-success'], null, { duration: 3000 });
      }
    });
  }

  recalculatePartnerBalance() {
    this.api.checkInvitedUsers(this.user.id).subscribe(res => {
      if (res instanceof ApiError) {
        this.snackBar.open(this.customValidator.messagesMap['snackbar.balance-edit-error'], null, { duration: 3000 });
      } else {
        this.snackBar.open('Balance recalculated', null, { duration: 3000 });
      }
    });
  }

  openAsUser() {
    const title = this.messages['confirm.user-open.title'];
    const msg = this.messages['confirm.user-open.msg'];

    const dialogModel = new ConfirmDialogModel(title, msg);

    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogModel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.session.openAsUser(this.user);
      }
    });
  }

  private callTranslate() {
    this.translate.get(Object.keys(this.messages)).subscribe(res => {
      this.messages = res;
    });
  }
}
