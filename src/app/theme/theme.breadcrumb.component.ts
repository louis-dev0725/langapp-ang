import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { BreadcrumbService } from "@app/theme/breadcrumb.service";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './theme.breadcrumb.component.html'
})
export class ThemeBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    constructor(public breadcrumbService: BreadcrumbService) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
