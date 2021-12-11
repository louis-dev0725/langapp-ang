import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@app/interfaces/common.interface';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CustomValidator } from '@app/services/custom-validator';
import { TranslatingService } from '@app/services/translating.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from '@app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  user: User;

  get isErrors() {
    return !this.contactForm.valid;
  }

  get language(): string {
    return localStorage.getItem('lang');
  }

  @ViewChild('frmVar', { static: true }) form;
  @ViewChild('recaptcha', { static: true }) recaptcha: ReCaptcha2Component;

  constructor(
    private translatingService: TranslatingService,
    public api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', { validators: [Validators.required], updateOn: 'change' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
      telephone: [''],
      body: ['', { validators: [Validators.required], updateOn: 'change' }],
      recaptcha: ['', Validators.required],
    });
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      if (user) {
        this.contactForm.patchValue({
          ...user,
        });
      }
      this.cd.detectChanges();
    });
  }

  onSubmit() {
    this.api.sendMessage(this.contactForm.value).subscribe(
      (res) => {
        this.snackBar.open(this.translatingService.translates['Messages sent'], null, { duration: 3000 });
        this.form.resetForm();
        this.contactForm.get('name').setValue(this.user.name);
        this.contactForm.get('email').setValue(this.user.email);
        this.contactForm.get('telephone').setValue(this.user.telephone);
      },
      (err) => {
        this.contactForm.reset(this.contactForm.value);
      }
    );
    this.reloadCaptcha();
  }

  checkError(fieldName: string) {
    let field = this.contactForm.get(fieldName);
    return (field.touched || field.dirty) && !field.valid;
  }

  getError(fieldName: string) {
    const errors = this.contactForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  resetCaptcha() {
    this.recaptcha.resetCaptcha();
  }

  reloadCaptcha() {
    this.recaptcha.reloadCaptcha();
  }

  ngOnDestroy() {}
}
