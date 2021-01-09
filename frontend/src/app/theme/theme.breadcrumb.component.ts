import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './theme.breadcrumb.component.html'
})
export class ThemeBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    constructor(public breadcrumbService: BreadcrumbService) {
        this.subscription = breadcrumbService.breadcrumbs$.subscribe(response => {
            this.items = response.map(b => <MenuItem>{ label: b.label });
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
