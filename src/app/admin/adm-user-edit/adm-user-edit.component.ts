import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';
import { SessionService } from '@app/services/session.service';
import { ApiError } from '@app/services/api-error';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EventService } from '@app/event.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/common/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-adm-user-edit',
  templateUrl: './adm-user-edit.component.html',
  styleUrls: ['./adm-user-edit.component.scss']
})
export class AdmUserEditComponent implements OnInit, OnDestroy {
  public userId;
  public languages = [
    {
      value: 'ru-RU',
      label: "Русский"
    },
    {
      value: 'en-Us',
      label: "English"
    },
  ];

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

  get selectedTimeZone(): any {
    if (this.user) {
      return this.user.timezone;
    }
    return '';
  }

  get errors() {
    return this._errors;
  };

  constructor(
    public session: SessionService,
    private api: ApiService,
    private confirmDialog: MatDialog,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.getUser(this.userId);

    this.api.getTimeZones().subscribe((res: any) => {
      this.timeZones = res;
    });

    this.callTranslate();

    this.globalEventSubscription = this.eventService.emitter.subscribe((event) => {
      if (event.type === 'language-change') {
        this.callTranslate();
      }
    });
    this.userProfile = this.formBuilder.group({
      id: [''],
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      company: [''],
      site: [''],
      telephone: [''],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
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
      comment: [''],
    });

    //todo: to uncomment when will be fix on backend
    /*forkJoin(
      this.getTransactions(this.userId),
      this.getTransactions(this.userId, 1)
    ).subscribe((res) => {
      console.log(res[0]);
      console.log(res[1]);
    });*/
  }

  ngOnDestroy(): void {
    if (this.globalEventSubscription) {
      this.globalEventSubscription.unsubscribe();
    }
  }

  public getTransactions(id: number, partner?) {
    return this.api.getTransactionByUser(id, partner);
  }

  public getUser(id: number) {
    return this.api.getUserById(id)
      .subscribe((res: any) => {
        this.user = res;
        this.session.userToEdit = res;
        this.updateForm(res);
      }, (err) => {
      })
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
    return !this.userProfile.get(fieldName).valid
  }

  getError(fieldName: string) {
    const errors = this.userProfile.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.userProfile.addControl('password', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
      this.userProfile.addControl('passrepeat', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
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
      enablePartnerPayments: this.userProfile.value.enablePartnerPayments ? 1: 0,
      isPartner: this.userProfile.value.isPartner ? 1: 0
    };
    this.api.updateUser(data).subscribe((res) => {
      if (res instanceof ApiError) {
        this._errors = res.error;
      } else {
        this.snackBar.open(this.customValidator.messagesMap['snackbar.user-edit-success'], null, {duration: 3000});
      }
    })
  }


  recalculatePartnerBalance() {
    this.api.checkInvitedUsers(this.user.id).subscribe((res) => {
      if (res instanceof ApiError) {
        this.snackBar.open(this.customValidator.messagesMap['snackbar.balance-edit-error'], null, {duration: 3000})
      } else {
        this.snackBar.open('Balance recalculated', null, {duration: 3000});
      }
    })
  }

  openAsUser() {

    const title = this.messages['confirm.user-open.title'];
    const msg = this.messages['confirm.user-open.msg'];

    const dialogModel = new ConfirmDialogModel(title, msg);

    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogModel
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.session.openAsUser(this.user)
      }
    })
  }

  private callTranslate() {
    this.translate.get(Object.keys(this.messages)).subscribe((res) => {
      this.messages = res;
    })
  }
}
