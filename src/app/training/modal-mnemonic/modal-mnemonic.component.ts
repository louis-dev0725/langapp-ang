import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Dictionary } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { ApiService } from '@app/services/api.service';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatingService } from '@app/services/translating.service';


@Component({
  selector: 'app-modal-mnemonic',
  templateUrl: './modal-mnemonic.component.html',
  styleUrls: ['./modal-mnemonic.component.scss']
})
export class ModalMnemonicComponent implements OnInit {

  @Input() elem: Dictionary;
  @Input() status: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  private _isLoaded = false;

  constructor(private api: ApiService, private snackBar: MatSnackBar, private translatingService: TranslatingService) { }

  ngOnInit() {}

  ratingChange(id: number, r_change: string) {
    console.log(id);
    console.log(r_change);

    this._isLoaded = true;
    const mnemonic_index = this.elem.mnemonic_all.findIndex(item => item.id === id);
    const mnemonic = this.elem.mnemonic_all[mnemonic_index];

    if (r_change === 'plus') {
      mnemonic.rating += 1;
      this.api.updateMnemonic(mnemonic).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.created, null, {duration: 3000});
        } else {
          this.snackBar.open(String(res.error), null, {duration: 3000});
        }

        this._isLoaded = false;
      });
    } else {
      mnemonic.rating -= 1;
      this.api.updateMnemonic(mnemonic).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.created, null, {duration: 3000});
        } else {
          this.snackBar.open(String(res.error), null, {duration: 3000});
        }

        this._isLoaded = false;
      });
    }
  }

  onCloseModal() {
    this.closeModal.emit();
  }
}
