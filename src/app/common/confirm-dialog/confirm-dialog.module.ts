import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from '@app/common/confirm-dialog/confirm-dialog.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent],
  imports: [MatButtonModule, MatDialogModule, TranslateModule],
  entryComponents: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {}
