import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatingService } from '@app/services/translating.service';

import { Dictionary, Mnemonic } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { ApiService } from '@app/services/api.service';

import { untilDestroyed } from 'ngx-take-until-destroy';


@Component({
  selector: 'app-modal-mnemonic',
  templateUrl: './modal-mnemonic.component.html',
  styleUrls: ['./modal-mnemonic.component.scss']
})
export class ModalMnemonicComponent implements OnInit, OnDestroy {

  @Input() elem: Dictionary;
  @Input() status: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterChangeMnemonic: EventEmitter<any> = new EventEmitter<any>();

  openCreateModal = false;
  twoModal = false;
  // @ts-ignore
  domain = window.rocket.apiHost;

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
    this._isLoaded = true;
    const mnemonic_index = this.elem.mnemonic_all.findIndex(item => item.id === id);
    const mnemonic = this.elem.mnemonic_all[mnemonic_index];

    if (r_change === 'plus') {
      mnemonic.rating += 1;
      mnemonic.user_rating = { user_id: this.elem.user_id, rating: 'plus' };
      this.api.updateMnemonic(mnemonic).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.rating_up, null,
            {duration: 3000});
        } else {
          this.snackBar.open(String(res.error), null, {duration: 3000});
        }

        this._isLoaded = false;
      });
    } else {
      mnemonic.rating -= 1;
      mnemonic.user_rating = { user_id: this.elem.user_id, rating: 'minus' };
      this.api.updateMnemonic(mnemonic).pipe(untilDestroyed(this)).subscribe(res => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].mnemonics.rating_down, null,
            {duration: 3000});
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

  onCreateMnemonic(status: boolean, ev: boolean = false) {
    this.openCreateModal = status;
    this.twoModal = status;
    if (ev) {
      this.onCloseModal();
    }
  }

  onAddMnemonicArray(data) {
    if (data.id !== null) {
      const mnemonic: Mnemonic = { id: data.id, text: data.text, images: data.image, rating: 0,
        user_id: this.elem.user_id, word: this.elem.original_word, mnemonicsUsers: [] };
      this.elem.mnemonic_all.push(mnemonic);
      this.enterChangeMnemonic.emit(mnemonic.id);
    }
  }

  enterMnemonic(id: number) {
    this.enterChangeMnemonic.emit(id);
  }

  ngOnDestroy() {}
}
