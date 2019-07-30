import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ThemeMenuComponent, ThemeSubMenuComponent } from "@app/theme/theme.menu.component";
import { ThemeTopbarComponent } from "@app/theme/theme.topbar.component";
import { ThemeMainComponent } from "@app/theme/theme.main.component";
import { ThemeFooterComponent } from "@app/theme/theme.footer.component";
import { RouterModule } from "@angular/router";


import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from "@app/theme/ui.module";
import { ThemeBreadcrumbComponent } from "@app/theme/theme.breadcrumb.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ContextMenuModule,
    MenuModule,
    MenubarModule,
    TranslateModule,
    UiModule
  ],
  declarations: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    ThemeBreadcrumbComponent
  ],
  exports: [
    ThemeMenuComponent,
    ThemeSubMenuComponent,
    ThemeTopbarComponent,
    ThemeMainComponent,
    ThemeFooterComponent,
    ThemeBreadcrumbComponent
  ],
  providers: [
  ]
})
export class ThemeModule {
}
