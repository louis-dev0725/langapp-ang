import { NgModule } from '@angular/core';
import { ConfirmDialogComponent } from '@app/common/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ConfirmDialogComponent],
    exports: [ConfirmDialogComponent],
    imports: [MatButtonModule, MatDialogModule, TranslateModule]
})
export class ConfirmDialogModule {}
