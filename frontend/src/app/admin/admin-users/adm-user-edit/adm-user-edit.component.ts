import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { EventService } from '@app/event.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { availableCurrencyList } from '@app/config/availableCurrencyList';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from '@app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-adm-user-edit',
  templateUrl: './adm-user-edit.component.html',
  styleUrls: ['./adm-user-edit.component.scss'],
})
export class AdmUserEditComponent implements OnInit, OnDestroy {
  public userId;
  public transactionList: any = [];
  public columns = ['id', 'money', 'currency', 'amount in', 'comment', 'addedDateTime', 'edit'];
  public transactionPartnerList: any = [];
  public languages = [
    {
      value: 'ru-RU',
      label: 'Русский',
    },
    {
      value: 'en-Us',
      label: 'English',
    },
  ];
  public currency = availableCurrencyList;
  public baseCurrency;
  public isLoadingTrans = false;
  public isLoadingTransPartner = false;

  private _errors = [];
  private globalEventSubscription: Subscription;

  isChangePassword = false;
  userProfile: UntypedFormGroup;
  user: User;
  timeZones: any[] = [];

  messages: any = {
    'confirm.user-open.title': '',
    'confirm.user-open.msg': '',
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

  constructor(public session: SessionService, public userService: UserService, private api: ApiService, private confirmDialog: MatDialog, private customValidator: CustomValidator, private eventService: EventService, private formBuilder: UntypedFormBuilder, private snackBar: MatSnackBar, private translate: TranslateService, private route: ActivatedRoute, private router: Router) {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.getUser(params.id);
    });
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.getUser(this.userId);

    this.api
      .getTimeZones()
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.timeZones = res;
      });

    this.sortTrans.sortChange.pipe(untilDestroyed(this)).subscribe((sort) => {
      this.getTrans(this.userId);
    });
    this.sortTransPartn.sortChange.pipe(untilDestroyed(this)).subscribe((sort) => {
      this.getPartnerTrans(this.userId);
    });

    this.callTranslate();

    this.globalEventSubscription = this.eventService.emitter.pipe(untilDestroyed(this)).subscribe((event) => {
      if (event.type === 'language-change') {
        this.callTranslate();
      }
    });
    this.userProfile = this.formBuilder.group({
      id: [''],
      name: ['', { validators: [Validators.required], updateOn: 'change' }],
      company: [''],
      currency: [''],
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
      frozeEnablePartnerPayments: [''],
      comment: [''],
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
    this.getTransactions(userId, 0, _sort, page)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.transactionList = res.items;
          this.transactionList.sort = this.sortTrans;
          this.transactionList.paginator = this.paginatorTrans;
          this.paginatorTrans.length = res._meta.totalCount;
          this.paginatorTrans.pageIndex = res._meta.currentPage - 1;
          this.isLoadingTrans = false;
        },
        (err) => {
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
    this.getTransactions(userId, 1, _sort, page)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.transactionPartnerList = res.items;
          /*this.transactionPartnerList = res.items.map(el => {
          const _mark = availableCurrencyList.find((item: any) => {
            return item.label == el.currency;
          }).value;
          return {
            ...el,
            currencyMark: _mark
          };
        });*/
          this.transactionList.sort = this.sortTransPartn;
          this.transactionList.paginator = this.paginatorPartnerTrans;
          this.paginatorPartnerTrans.length = res._meta.totalCount;
          this.paginatorPartnerTrans.pageIndex = res._meta.currentPage - 1;
          this.isLoadingTransPartner = false;
        },
        (err) => {
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
    this.router.navigate([`/admin/transactions/${row.id}`]);
  }

  public getTransactions(id: number, partner?, sort?, page?) {
    return this.api.getTransactionByUser(id, partner, sort, page);
  }

  public onPageChange(event: PageEvent, partner?) {
    partner ? this.getPartnerTrans(this.userId) : this.getTrans(this.userId);
  }

  public getUser(id: number) {
    return this.api
      .getUserById(id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: any) => {
          this.user = res;
          this.baseCurrency = this.user.currency;
          this.updateForm(res);
        },
        (err) => {}
      );
  }

  public updateForm(res) {
    this.userProfile.patchValue({
      id: res.id,
      ...res,
    });
  }

  get isServicePaused(): boolean {
    if (!this.user) {
      return false;
    }
    return this.user.isServicePaused !== undefined ? !!this.user.isServicePaused : false;
  }

  checkError(fieldName: string) {
    return !this.userProfile.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.userProfile, fieldName);
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.userProfile.addControl(
        'password',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change',
        })
      );
      this.userProfile.addControl(
        'passrepeat',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change',
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
      isPartner: this.userProfile.value.isPartner ? 1 : 0,
      frozeEnablePartnerPayments: this.userProfile.value.frozeEnablePartnerPayments ? 1 : 0,
    };
    this.api
      .updateUser(data)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res instanceof ApiError) {
          this._errors = res.error;
        } else {
          this.snackBar.open(this.translate.instant('snackbar.user-edit-success'), null, { duration: 3000 });
        }
      });
  }

  recalculatePartnerBalance() {
    this.api
      .checkInvitedUsers(this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res instanceof ApiError) {
          this.snackBar.open(this.translate.instant('snackbar.balance-edit-error'), null, { duration: 3000 });
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
      data: dialogModel,
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.userService.openAsUser(this.user);
        }
      });
  }

  private callTranslate() {
    this.translate
      .get(Object.keys(this.messages))
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.messages = res;
      });
  }
}
