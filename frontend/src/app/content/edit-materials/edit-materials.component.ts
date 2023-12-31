import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from '@app/services/translating.service';
import { ApiService } from '@app/services/api.service';
import { CustomValidator } from '@app/services/custom-validator';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Content } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-edit-materials',
  templateUrl: './edit-materials.component.html',
  styleUrls: ['./edit-materials.component.scss'],
})
export class EditMaterialsComponent implements OnInit, OnDestroy {
  material: Content;
  errors: any[] = [];
  materialForm: UntypedFormGroup;
  material_id;
  categories = [];
  types = [];

  constructor(public session: SessionService, private translatingService: TranslatingService, private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {}

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  ngOnInit() {
    this.material_id = this.route.snapshot.paramMap.get('id');
    combineLatest([this.api.contentById(this.material_id), this.api.getContentTypes(), this.api.getCategories()])
      .pipe(untilDestroyed(this))
      .subscribe(([material, type, category]) => {
        this.types = type;
        if (!(category instanceof ApiError)) {
          this.categories = category.items;
        } else {
          this.errors.push(category.error);
        }
        if (!(material instanceof ApiError)) {
          this.material = material;
          this.updateForm(this.material);
        } else {
          this.errors = material.error;
        }

        this._isLoaded = true;
      });

    const urlRegex = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.materialForm = this.formBuilder.group({
      id: ['', { validators: [Validators.nullValidator] }],
      title: ['', { validators: [Validators.required] }],
      category: ['', { validators: [Validators.required] }],
      type: ['', { validators: [Validators.required] }],
      sourceLink: ['', { validators: [Validators.required, Validators.pattern(urlRegex)] }],
      text: ['', { validators: [Validators.required] }],
    });
  }

  updateForm(res) {
    const cat = [];
    res.categories.forEach((category) => {
      cat.push(category.id);
    });
    this.materialForm.patchValue({
      id: res.id,
      ...res,
      category: cat,
    });
  }

  checkError(fieldName: string) {
    return !this.materialForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.materialForm, fieldName);
  }

  onSubmit() {
    this._isLoaded = false;

    const materials = {
      ...this.materialForm.value,
      length: this.materialForm.value.text.length,
      level: 'N3',
      status: this.material.status,
      deleted: this.material.deleted,
    };
    this.api
      .updateMaterials(materials)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].materials.updated, null, { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/content/materials']);
          }, 3100);
        } else {
          this.errors = res.error;
        }

        this._isLoaded = true;
      });
  }

  ngOnDestroy(): void {}
}
