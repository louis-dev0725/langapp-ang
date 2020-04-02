import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiError } from '@app/services/api-error';
import { FieldError } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private api: ApiService, private custValidator: CustomValidator, private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute) {}

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }
  signinForm: FormGroup;
  errors: FieldError[] = [];
  activePlugin = false;

  private _isLoaded = true;

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
      password: ['', { validators: [Validators.required], updateOn: 'change' }]
    });

    this.route.queryParams.subscribe(
      (params: Params) => {
        if (params.enterPlugin) {
          this.activePlugin = true;
        }
      }
    );
  }

  onSubmit(value: any) {
    this.errors = [];
    this.isLoaded = false;
    this.api.login(value).subscribe(res => {
      if (res instanceof ApiError) {
        this.errors = res.error;
      } else {
        if (this.activePlugin) {
          this.router.navigate(['/settings/plugin']);
        } else {
          this.router.navigate(['/payment']);
        }
      }
    });
  }

  getErrors(fieldName: string): string {
    const errors = this.signinForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.custValidator.errorMap[key] ? this.custValidator.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    return !!this.signinForm.get(fieldName).errors;
  }
}
