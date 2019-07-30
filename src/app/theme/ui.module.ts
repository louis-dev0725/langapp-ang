import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule, ScrollPanelModule} from "primeng/primeng";
import { VirtualScrollerModule } from "primeng/virtualscroller";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ScrollPanelModule,
    VirtualScrollerModule,
  ],
  exports: [
    BreadcrumbModule,
    ScrollPanelModule,
    VirtualScrollerModule,
  ]

})
export class UiModule { }
