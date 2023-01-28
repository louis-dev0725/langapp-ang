import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { CustomValidator } from '@app/services/custom-validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from '@app/services/translating.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiError } from '@app/services/api-error';
import { combineLatest } from 'rxjs';
import { Category } from '@app/interfaces/common.interface';

@UntilDestroy()
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  categoryForm: UntypedFormGroup;
  category: Category;
  category_id;
  errors: any = [];
  parents = [];

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private snackBar: MatSnackBar, private router: Router, private session: SessionService, private translatingService: TranslatingService, private route: ActivatedRoute) {}

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  ngOnInit() {
    this.category_id = this.route.snapshot.paramMap.get('id');
    combineLatest([this.api.getCategoryById(this.category_id), this.api.getCategories()])
      .pipe(untilDestroyed(this))
      .subscribe(([category, parents]) => {
        if (!(category instanceof ApiError)) {
          this.category = category;
          this.updateForm(this.category);
        } else {
          this.errors.push(category.error);
        }
        if (!(parents instanceof ApiError)) {
          this.parents = parents.items;
        } else {
          this.errors = parents.error;
        }

        this._isLoaded = true;
      });

    this.categoryForm = this.formBuilder.group({
      id: ['', { validators: [Validators.nullValidator] }],
      title: ['', { validators: [Validators.required] }],
      parent_id: ['', { validators: [Validators.required] }],
    });
  }

  updateForm(res) {
    this.categoryForm.patchValue({
      ...res,
    });
  }

  checkError(fieldName: string) {
    return !this.categoryForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.categoryForm, fieldName);
  }

  checkUserSelection(id) {
    return parseInt(id) === parseInt(this.category_id);
  }

  onSubmit() {
    this._isLoaded = false;

    const category = {
      ...this.categoryForm.value,
    };
    this.api
      .updateCategory(category)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].categories.updated, null, { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/category/categories']);
          }, 3100);
        } else {
          this.errors = res.error;
        }

        this._isLoaded = true;
      });
  }

  ngOnDestroy() {}
}
