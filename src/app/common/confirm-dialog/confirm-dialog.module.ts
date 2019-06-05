import {NgModule} from '@angular/core';
import {ConfirmDialogComponent} from '@app/common/confirm-dialog/confirm-dialog.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';

@NgModule({
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {

}
