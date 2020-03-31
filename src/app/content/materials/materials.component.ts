import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { combineLatest } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { Contents } from '@app/interfaces/common.interface';
import { Router } from '@angular/router';
import { TranslatingService } from '@app/services/translating.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  complications = [];
  types = [];
  volumes = [];
  daraSource: Contents;
  keyword = '';
  complication = '';
  type = '';
  volume = '';

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder,
    private router: Router, private translatingService: TranslatingService, private snackBar: MatSnackBar) { }

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  @Input()
  set isLoadedData(val: boolean) {
    this._isLoadedData = val;
  }

  get isLoadedData(): boolean {
    return this._isLoadedData;
  }

  private _isLoaded = false;
  private _isLoadedData = false;

  ngOnInit() {
    combineLatest([this.api.getComplicationContent(), this.api.getTypeContent(), this.api.getVolumeContent()])
      .pipe(untilDestroyed(this)).subscribe(([complications, types, volumes]) => {
        this.complications = complications;
        this.types = types;
        this.volumes = volumes;
        this._isLoaded = true;
    });

    const data = '';
    this.api.getMaterials(data).pipe(untilDestroyed(this)).subscribe(res => {
      this.daraSource = res;
      this._isLoadedData = true;
    });

    this.filterForm = this.formBuilder.group({
      keywords: ['', { validators: [Validators.required] }],
    });
  }

  checkError(fieldName: string) {
    return !this.filterForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.filterForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];

    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  onChangeComplication(event) {
    this._isLoadedData = false;
    this.complication = event.value;
    let data = 'complication=' + this.complication;
    if (this.keyword !== undefined && this.keyword !== '') {
      data = data + '&keyword=' + encodeURIComponent(this.keyword);
    }
    if (this.type !== undefined || this.type !== '') {
      data = data + '&type=' + this.type;
    }
    if (this.volume !== undefined && this.volume !== '') {
      data = data + '&volume=' + this.volume;
    }
    this.api.getMaterials(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        console.log(res.error);
      }

      this._isLoadedData = true;
    });
  }

  onChangeType(event) {
    this._isLoadedData = false;
    this.type = event.value;
    let data = '';
    if (this.keyword !== undefined && this.keyword !== '') {
      data = data + 'keyword=' + encodeURIComponent(this.keyword);
    }
    if (this.complication !== undefined && this.complication !== '') {
      data = data + '&complication=' + this.complication;
    }
    data = data + '&type=' + this.type;
    if (this.volume !== undefined && this.volume !== '') {
      data = data + '&volume=' + this.volume;
    }
    this.api.getMaterials(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        console.log(res.error);
      }

      this._isLoadedData = true;
    });
  }

  onChangeVolumes(event) {
    this._isLoadedData = false;
    this.volume = event.value;
    let data = '';
    if (this.keyword !== undefined && this.keyword !== '') {
      data = data + 'keyword=' + encodeURIComponent(this.keyword);
    }
    if (this.complication !== undefined && this.complication !== '') {
      data = data + '&complication=' + this.complication;
    }
    if (this.type !== undefined && this.type !== '') {
      data = data + '&type=' + this.type;
    }
    data = data + '&volume=' + this.volume;
    this.api.getMaterials(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        console.log(res.error);
      }

      this._isLoadedData = true;
    });
  }

  changePageTable(data) {
    this._isLoadedData = false;
    let href = this.daraSource._links.self.href.split('?')[1].split('page')[0];
    href = href + 'page=' + (+(data.pageIndex) + 1) + '&per-page=' + data.pageSize;

     this.api.getMaterials(href).pipe(untilDestroyed(this)).subscribe(res => {
      this.daraSource = res;
      this._isLoadedData = true;
     });
  }

  deleteMaterial(event) {
     this._isLoadedData = false;

     this.api.deleteMaterial(event).pipe(untilDestroyed(this)).subscribe(res => {
       if (!(res instanceof ApiError)) {
         this.snackBar.open(this.translatingService.translates['confirm'].materials.deleted, null, {duration: 3000});
         const elem = this.daraSource.items.findIndex(item => item.id === event);
         this.daraSource.items.splice(elem, 1);
       } else {
         console.log(res.error);
       }

       this._isLoadedData = true;
     });
  }

  onSubmitSearch() {
    this._isLoadedData = false;
    this.keyword = this.filterForm.value.keywords;
    let data = 'title=' + encodeURIComponent(this.keyword);

    if (this.complication !== undefined && this.complication !== '') {
      data = data + '&complication=' + this.complication;
    }
    if (this.type !== undefined && this.type !== '') {
      data = data + '&type=' + this.type;
    }
    if (this.volume !== undefined && this.volume !== '') {
      data = data + '&volume=' + this.volume;
    }
    this.api.getMaterials(data).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.daraSource = res;
      } else {
        console.log(res.error);
      }

      this._isLoadedData = true;
    });
  }

  ngOnDestroy () {}
}
