import { Component, Input, OnInit } from '@angular/core';

import { Dictionary } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { ApiService } from '@app/services/api.service';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatingService } from '@app/services/translating.service';

@Component({
  selector: 'app-create-mnemonic-modal',
  templateUrl: './create-mnemonic-modal.component.html',
  styleUrls: ['./create-mnemonic-modal.component.scss']
})
export class CreateMnemonicModalComponent implements OnInit {

  @Input() elem: Dictionary;
  @Input() status_add: boolean;
  selectedFile: File = null;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor(private api: ApiService, private snackBar: MatSnackBar, private translatingService: TranslatingService) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    fd.append('user_id', String(this.elem.user_id));
    fd.append('word', this.elem.original_word);
    fd.append('image', this.selectedFile, this.selectedFile.name);

    console.log('res: ', fd);

    this._isLoaded = true;
    this.api.createMnemonic(fd).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.created, null, {duration: 3000});
      } else {
        this.snackBar.open(String(res.error), null, {duration: 3000});
      }

      this._isLoaded = false;
    });
  }

  onCloseModal() {
    this.status_add = false;
  }
}
