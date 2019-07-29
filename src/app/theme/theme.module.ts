import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ThemeMenuComponent, ThemeSubMenuComponent } from "@app/theme/theme.menu.component";
import { ThemeTopbarComponent } from "@app/theme/theme.topbar.component";
import { ThemeMainComponent } from "@app/theme/theme.main.component";
import { ThemeFooterComponent } from "@app/theme/theme.footer.component";
import { RouterModule } from "@angular/router";


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    CardModule,
    ContextMenuModule,
    MenuModule,
    MenubarModule,
    ScrollPanelModule,
    VirtualScrollerModule,

    TranslateModule
  ],
  declarations: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent
  ],
  exports: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    BreadcrumbModule,
    CardModule,
    ContextMenuModule,
    MenuModule,
    MenubarModule,
    ScrollPanelModule,
    VirtualScrollerModule,
  ],
  providers: []
})
export class ThemeModule {
}
