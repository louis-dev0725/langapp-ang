import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { BreadcrumbModule, MessageService, ScrollPanelModule } from 'primeng/primeng';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { HocBreadCrumbComponent } from '@app/shared/hoc/hoc-bread-crumb/hoc-bread-crumb.component';
import { BreadCrumbsService } from '@app/services/bread-crumbs.service';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { NotificationsComponent } from '@app/common/notifications/notifications.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
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
    MatSnackBarModule,
    MessagesModule,
    MessageModule
  ],
  declarations: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    HocBreadCrumbComponent,
    NotificationsComponent
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
  providers: [BreadCrumbsService, MessageService]
})
export class ThemeModule {}
