import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { CustomValidator } from '@app/services/custom-validator';
import { SessionService } from '@app/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatingService } from '@app/services/translating.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiError } from '@app/services/api-error';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-create-materials',
  templateUrl: './create-materials.component.html',
  styleUrls: ['./create-materials.component.scss'],
})
export class CreateMaterialsComponent implements OnInit, OnDestroy {
  materialsForm: FormGroup;
  errors: any = [];
  categories = [];
  types = [];

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private session: SessionService, private translatingService: TranslatingService) {}

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  ngOnInit() {
    this.api
      .getContentTypes()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.types = res;
      });

    this.api
      .getCategories()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.categories = res.items;

          this._isLoaded = true;
        } else {
          this.errors = res.error;
        }
      });

    const urlRegex = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.materialsForm = this.formBuilder.group({
      title: ['', { validators: [Validators.required] }],
      category: ['', { validators: [Validators.required] }],
      type: ['', { validators: [Validators.required] }],
      sourceLink: ['', { validators: [Validators.pattern(urlRegex)] }],
      text: ['', { validators: [Validators.required] }],
    });
  }

  checkError(fieldName: string) {
    return !this.materialsForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.materialsForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];

    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  onSubmit() {
    this._isLoaded = false;

    const materials = {
      ...this.materialsForm.value,
      length: this.materialsForm.value.text.length,
      level: 'N1',
      status: 0,
      deleted: 0,
    };
    this.api
      .createMaterials(materials)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].materials.created, null, { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/content/materials']);
          }, 3100);
        } else {
          this.errors = res.error;
        }

        this._isLoaded = true;
      });
  }

  ngOnDestroy() {}
}
