import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ThemeMenuComponent, ThemeSubMenuComponent } from '@app/theme/theme.menu.component';
import { ThemeTopbarComponent } from '@app/theme/theme.topbar.component';
import { ThemeMainComponent } from '@app/theme/theme.main.component';
import { ThemeFooterComponent } from '@app/theme/theme.footer.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { BreadcrumbModule, ScrollPanelModule } from 'primeng/primeng';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { HocBreadCrumbComponent } from '@app/shared/hoc/hoc-bread-crumb/hoc-bread-crumb.component';
import { BreadCrumbsService } from '@app/services/bread-crumbs.service';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ContextMenuModule,
    MenuModule,
    MenubarModule,
    TranslateModule,
    SharedModule,
    BreadcrumbModule,
    ScrollPanelModule,
    VirtualScrollerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    HocBreadCrumbComponent
  ],
  exports: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    BreadcrumbModule,
    ScrollPanelModule,
    VirtualScrollerModule,
    HocBreadCrumbComponent,
    MatSnackBarModule
  ],
  providers: [BreadCrumbsService, DecimalPipe]
})
export class ThemeModule {}
