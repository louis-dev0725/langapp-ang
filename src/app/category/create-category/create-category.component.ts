import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { CustomValidator } from '@app/services/custom-validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from '@app/services/translating.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiError } from '@app/services/api-error';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  errors: any = [];
  parents = [];

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private router: Router, private session: SessionService,
    private translatingService: TranslatingService) { }

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  ngOnInit() {
    this.api.getCategories().pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.parents = res.items;

        this._isLoaded = true;
      } else {
        this.errors = res.error;
      }
    });

    this.categoryForm = this.formBuilder.group({
      title: ['', { validators: [Validators.required] }],
      parent_id: ['', { validators: [Validators.required] }],
    });
  }

  checkError(fieldName: string) {
    return !this.categoryForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.categoryForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];

    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  onSubmit() {
    this._isLoaded = false;

    const category = {
      ...this.categoryForm.value,
    };
    this.api.createCategory(category).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].categories.created, null, {duration: 3000});
        setTimeout(() => {
          this.router.navigate(['/category/categories']);
        }, 3100);
      } else {
        this.errors = res.error;
      }

      this._isLoaded = true;
    });
  }

  ngOnDestroy () {}
}
