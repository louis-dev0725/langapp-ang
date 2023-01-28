import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserDictionary } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { ApiService } from '@app/services/api.service';
import { TranslatingService } from '@app/services/translating.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-create-mnemonic-modal',
  templateUrl: './create-mnemonic-modal.component.html',
  styleUrls: ['./create-mnemonic-modal.component.scss']
})
export class CreateMnemonicModalComponent implements OnInit, OnDestroy {

  @Input() elem: UserDictionary;
  @Input() status_add: boolean;
  @Output() closeModalCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output() createMnemonic: EventEmitter<any> = new EventEmitter<any>();

  selectedFile: File = null;
  mnemonicForm: UntypedFormGroup;
  errors: any = [];

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor(private api: ApiService, private snackBar: MatSnackBar, private translatingService: TranslatingService,
              private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.mnemonicForm = this.formBuilder.group({
      text_mnemonic: [null, { validators: [] }],
      image_mnemonic: [null, { validators: [] }],
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];

    this.errors = [];
    if (this.selectedFile.size > 10 * 1024 * 1024) {
      this.errors.push({ message: this.translatingService.translates.ErrorMnemonicSize });
    }
  }


  onSubmit() {
    this._isLoaded = true;

    const mnemonic = {
      ...this.mnemonicForm.value,
    };

    const fd = new FormData();
    fd.append('user_id', String(this.elem.user_id));
    fd.append('word', this.elem.original_word);

    if (mnemonic.text_mnemonic === '' && mnemonic.image_mnemonic === '') {
      this.errors.push({ message: this.translatingService.translates.EmptyOneField });
      this._isLoaded = false;
    } else {
      this.errors = [];

      if (this.mnemonicForm.value.text_mnemonic !== null) {
        fd.append('text', this.mnemonicForm.value.text_mnemonic);
      }

      if (this.selectedFile !== null) {
        fd.append('image', this.selectedFile, this.selectedFile.name);
      }

      this._isLoaded = true;
      this.api.createMnemonic(fd).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.mnemonicForm.reset();
          this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.created, null,
            { duration: 3000 });

          this.createMnemonic.emit({ id: res.id, text: res.text, image: res.image });
          this.closeModalCreate.emit(true);
        } else {
          this.snackBar.open(String(res.error), null, { duration: 3000 });
        }

        this._isLoaded = false;
      });
    }
  }

  onCloseModal() {
    this.closeModalCreate.emit();
  }

  ngOnDestroy() {}
}
